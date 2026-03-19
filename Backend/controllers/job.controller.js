import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";

const computeMatchInfo = (userSkills = [], jobRequirements = []) => {
  const normalizedUser = userSkills.map((s) => s.toLowerCase().trim()).filter(Boolean);
  const normalizedJob = jobRequirements.map((s) => s.toLowerCase().trim()).filter(Boolean);

  const userSet = new Set(normalizedUser);
  const jobSet = new Set(normalizedJob);

  if (jobSet.size === 0 || userSet.size === 0) {
    return { matchScore: 0, matchedSkills: [], missingSkills: Array.from(jobSet) };
  }

  const matchedSkills = Array.from(jobSet).filter((skill) => userSet.has(skill));
  const missingSkills = Array.from(jobSet).filter((skill) => !userSet.has(skill));
  const unionSize = new Set([...jobSet, ...userSet]).size;
  const matchScore = Math.round((matchedSkills.length / unionSize) * 100);

  return { matchScore, matchedSkills, missingSkills };
};
//Admin job posting
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // If a logo file is provided, update the company logo (so it appears on job cards)
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const upload = await cloudinary.uploader.upload(fileUri.content, {
        folder: "job-portal/company-logos",
        overwrite: true,
      });

      await Company.findByIdAndUpdate(companyId, {
        logo: upload.secure_url,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary,
      location,
      jobType,
      experience,
      position,
      company: companyId,
      created_by: userId,
    });
    res.status(201).json({
      message: "Job posted successfully.",
      job,
      status: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Users - advanced search + filters + pagination
export const getAllJobs = async (req, res) => {
  try {
    const {
      keyword = "",
      location,
      jobType,
      minSalary,
      maxSalary,
      experience,
      sortBy = "latest",
      page = 1,
      limit = 10,
    } = req.query;

    const numericLimit = Math.min(parseInt(limit, 10) || 10, 50);
    const numericPage = Math.max(parseInt(page, 10) || 1, 1);

    const query = {
      $and: [
        {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
            { requirements: { $regex: keyword, $options: "i" } },
            { location: { $regex: keyword, $options: "i" } },
            { jobType: { $regex: keyword, $options: "i" } },
          ],
        },
      ],
    };

    if (location) {
      query.$and.push({ location: { $regex: location, $options: "i" } });
    }

    if (jobType) {
      query.$and.push({ jobType });
    }

    if (experience) {
      query.$and.push({ experience: { $regex: experience, $options: "i" } });
    }

    // salary is stored as string; basic range filter assuming e.g. "10 LPA"
    if (minSalary || maxSalary) {
      const salaryConditions = {};
      if (minSalary) {
        salaryConditions.$gte = String(minSalary);
      }
      if (maxSalary) {
        salaryConditions.$lte = String(maxSalary);
      }
      query.$and.push({ salary: salaryConditions });
    }

    let sortQuery = { createdAt: -1 };
    if (sortBy === "salary-desc") {
      sortQuery = { salary: -1 };
    } else if (sortBy === "salary-asc") {
      sortQuery = { salary: 1 };
    }

    const skip = (numericPage - 1) * numericLimit;

    const [jobsRaw, total] = await Promise.all([
      Job.find(query)
        .populate({ path: "company" })
        .sort(sortQuery)
        .skip(skip)
        .limit(numericLimit),
      Job.countDocuments(query),
    ]);

    let jobs = jobsRaw;

    // If user is authenticated, attach matchScore to each job
    if (req.id) {
      const user = await User.findById(req.id);
      const userSkills = user?.profile?.skills || [];

      jobs = jobsRaw.map((job) => {
        const { matchScore } = computeMatchInfo(userSkills, job.requirements || []);
        return { ...job.toObject(), matchScore };
      });
    }

    return res.status(200).json({
      jobs,
      total,
      page: numericPage,
      totalPages: Math.ceil(total / numericLimit),
      status: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Users
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate("company");
    if (!job) {
      return res.status(404).json({ message: "Job not found", status: false });
    }

    let matchInfo = null;
    if (req.id) {
      const user = await User.findById(req.id);
      const userSkills = user?.profile?.skills || [];
      matchInfo = computeMatchInfo(userSkills, job.requirements || []);
    }

    return res.status(200).json({ job, matchInfo, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Admin job created

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId });
    // .populate("company")
    // .sort({ createdAt: -1 });

    // Even if the recruiter has no jobs yet, return success with an empty list.
    // This keeps the front-end UI consistent and avoids showing an error state.
    return res.status(200).json({ jobs: jobs || [], status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};
