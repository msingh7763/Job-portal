import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";
import crypto from "crypto";
import { sendMail } from "../utils/mailer.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isProduction = process.env.NODE_ENV === "production";
const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Strict",
  path: "/",
};

/* ========================= REGISTER ========================= */

export const register = asyncHandler(async (req, res, next) => {
  const { fullname, email, phoneNumber, password, role: requestedRole } = req.body;

  if (!fullname || !email || !phoneNumber || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Default role for all new accounts
  let role = "Student";

  // Allow users to choose either Student or Recruiter
  if (requestedRole === "Recruiter") {
    role = "Recruiter";
  }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    let profilePhoto = "";

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const upload = await cloudinary.uploader.upload(fileUri.content);
      profilePhoto = upload.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto,
      },
    });

  return res.status(201).json({
    success: true,
    message: `Account created successfully for ${newUser.fullname}`,
  });
});

/* ========================= LOGIN ========================= */

export const login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as ${user.role}. Please select ${user.role} to continue.`,
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      savedJobs: user.savedJobs,
      profile: user.profile,
    };

    res
      .cookie("token", token, {
        ...authCookieOptions,
        maxAge: 24 * 60 * 60 * 1000,
      })
    .status(200)
    .json({
      success: true,
      message: `Welcome back ${safeUser.fullname}`,
      user: safeUser,
    });
});

/* ========================= LOGOUT ========================= */

export const logout = asyncHandler(async (req, res, next) => {
  res
      .cookie("token", "", {
        ...authCookieOptions,
        maxAge: 0,
        expires: new Date(0),
      })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

/* ========================= UPDATE PROFILE ========================= */

export const updateProfile = asyncHandler(async (req, res, next) => {
  const { fullname, email, phoneNumber, bio, skills } = req.body;
  const userId = req.id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (fullname) user.fullname = fullname;
  if (email) user.email = email;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (bio) user.profile.bio = bio;
  if (skills) {
    user.profile.skills = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  const profilePhotoFile = req.files?.profilePhoto?.[0] || null;
  const resumeFile = req.files?.resume?.[0] || null;

  if (profilePhotoFile) {
    const fileUri = getDataUri(profilePhotoFile);
    const upload = await cloudinary.uploader.upload(fileUri.content, {
      folder: "job-portal/profile-photos",
      resource_type: "image",
    });
    user.profile.profilePhoto = upload.secure_url;
  }

  if (resumeFile) {
    const fileUri = getDataUri(resumeFile);
    const upload = await cloudinary.uploader.upload(fileUri.content, {
      folder: "job-portal/resumes",
      resource_type: "raw",
    });
    user.profile.resume = upload.secure_url;
    user.profile.resumeOriginalName = resumeFile.originalname;
  }

  // Backward compatibility for old clients that still send "file".
  if (!profilePhotoFile && !resumeFile && req.file) {
    const fileUri = getDataUri(req.file);
    const isImage = req.file.mimetype?.startsWith("image/");
    const upload = await cloudinary.uploader.upload(fileUri.content, {
      folder: isImage ? "job-portal/profile-photos" : "job-portal/resumes",
      resource_type: isImage ? "image" : "raw",
    });

    if (isImage) {
      user.profile.profilePhoto = upload.secure_url;
    } else {
      user.profile.resume = upload.secure_url;
      user.profile.resumeOriginalName = req.file.originalname;
    }
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

/* ========================= FORGOT PASSWORD ========================= */

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const frontendBaseUrl =
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      process.env.CORS_ORIGINS?.split(",")?.[0]?.trim() ||
      "http://localhost:5173";

    const resetLink = `${frontendBaseUrl.replace(/\/+$/, "")}/reset-password/${token}`;

    await sendMail({
      to: user.email,
      subject: "Password Reset",
      html: `
      <p>Hello ${user.fullname},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 1 hour.</p>
      `,
    });

  res.status(200).json({
    success: true,
    message: "Password reset link sent to email",
  });
});

/* ========================= RESET PASSWORD ========================= */

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token invalid or expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

/* ========================= TOGGLE SAVED JOB ========================= */

export const toggleSavedJob = asyncHandler(async (req, res, next) => {
  const userId = req.id;
  const { jobId } = req.body;

  if (!jobId) {
    return res.status(400).json({ success: false, message: "jobId is required" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const isSaved = user.savedJobs.some((id) => id.toString() === jobId);
  if (isSaved) {
    user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
  } else {
    user.savedJobs.push(jobId);
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: isSaved ? "Job removed from saved list" : "Job saved successfully",
    savedJobs: user.savedJobs.map((id) => id.toString()),
  });
});

/* ========================= GET SAVED JOBS ========================= */

export const getSavedJobs = asyncHandler(async (req, res, next) => {
  const userId = req.id;

  const user = await User.findById(userId).populate({
    path: "savedJobs",
    populate: {
      path: "company"
    }
  });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    savedJobs: user.savedJobs,
  });
});