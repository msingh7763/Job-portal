import express from "express";
import { body, validationResult } from "express-validator";

import {
  login,
  logout,
  register,
  updateProfile,
  toggleSavedJob,
  getSavedJobs,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";

import authenticateToken from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

/* -------------------- Validation Middleware -------------------- */

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

/* -------------------- Register -------------------- */

router.post(
  "/register",
  singleUpload,

  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email"),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+?[0-9\s-]{7,20}$/)
    .withMessage("Enter a valid phone number (digits, +, -, spaces)"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("role")
    .optional()
    .isIn(["Student", "Recruiter"])
    .withMessage("Role must be Student or Recruiter"),

  validateRequest,
  register
);

/* -------------------- Login -------------------- */

router.post(
  "/login",

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  body("role")
    .optional()
    .isIn(["Student", "Recruiter"])
    .withMessage("Role must be Student or Recruiter"),

  validateRequest,
  login
);

/* -------------------- Logout -------------------- */

router.post("/logout", logout);

/* -------------------- Update Profile -------------------- */

router.post(
  "/profile/update",
  authenticateToken,
  singleUpload,

  body("fullname")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Enter a valid email"),

  body("phoneNumber")
    .optional()
    .matches(/^\+?[0-9\s-]{7,20}$/)
    .withMessage("Enter a valid phone number (digits, +, -, spaces)"),

  validateRequest,
  updateProfile
);

/* -------------------- Saved Jobs -------------------- */

router.get("/saved", authenticateToken, getSavedJobs);

router.post("/saved/toggle", authenticateToken, toggleSavedJob);

/* -------------------- Forgot Password -------------------- */

router.post(
  "/forgot-password",

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email"),

  validateRequest,
  forgotPassword
);

/* -------------------- Reset Password -------------------- */

router.post(
  "/reset-password/:token",

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  validateRequest,
  resetPassword
);

export default router;