import { Company } from "../models/company.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";

// NOTE: These controllers are wrapped with asyncHandler to forward errors to the global error middleware.

export const registerCompany = asyncHandler(async (req, res) => {
  const { companyName } = req.body;
  if (!companyName) {
    return res.status(400).json({
      message: "Company name is required",
      success: false,
    });
  }

  const existingCompany = await Company.findOne({ name: companyName, userId: req.id });
  if (existingCompany) {
    return res.status(400).json({
      message: "Company already exists",
      success: false,
    });
  }

  let logoUrl = "";
  if (req.file) {
    const fileUri = getDataUri(req.file);
    const upload = await cloudinary.uploader.upload(fileUri.content, {
      folder: "job-portal/company-logos",
      overwrite: true,
    });
    logoUrl = upload.secure_url;
  }

  const company = await Company.create({
    name: companyName,
    userId: req.id,
    logo: logoUrl,
  });

  return res.status(201).json({
    message: "Company registered successfully.",
    company,
    success: true,
  });
});

export const getAllCompanies = asyncHandler(async (req, res) => {
  const userId = req.id; // logged-in user id
  const companies = await Company.find({ userId });

  return res.status(200).json({
    companies: companies || [],
    success: true,
  });
});

// get company by id
export const getCompanyById = asyncHandler(async (req, res) => {
  const companyId = req.params.id;
  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  return res.status(200).json({ company, success: true });
});

// update company details
export const updateCompany = asyncHandler(async (req, res) => {
  const { name, description, website, location } = req.body;
  const companyId = req.params.id;
  const userId = req.id;

  const company = await Company.findById(companyId);
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  if (company.userId.toString() !== userId) {
    return res.status(403).json({ message: "Forbidden", success: false });
  }

  // Prevent updating to a name that the user already has for another company
  if (name) {
    const existing = await Company.findOne({
      name,
      userId,
      _id: { $ne: companyId },
    });
    if (existing) {
      return res.status(400).json({
        message: "Company name already in use",
        success: false,
      });
    }
  }

  const updateData = { name, description, website, location };

  if (req.file) {
    const fileUri = getDataUri(req.file);
    const upload = await cloudinary.uploader.upload(fileUri.content, {
      folder: "job-portal/company-logos",
      overwrite: true,
    });
    updateData.logo = upload.secure_url;
  }

  const updatedCompany = await Company.findByIdAndUpdate(companyId, updateData, {
    new: true,
  });

  return res.status(200).json({ message: "Company updated", success: true, company: updatedCompany });
});

// delete company
export const deleteCompany = asyncHandler(async (req, res) => {
  const companyId = req.params.id;
  const userId = req.id;

  const company = await Company.findById(companyId);
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  if (company.userId.toString() !== userId) {
    return res.status(403).json({ message: "Forbidden", success: false });
  }

  await company.deleteOne();

  return res.status(200).json({ message: "Company deleted", success: true });
});
