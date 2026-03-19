import express from "express";
import { body, validationResult } from "express-validator";
import authenticateToken from "../middleware/isAuthenticated.js";
import { authorizeRoles } from "../middleware/roleAuthorization.js";
import { singleUpload } from "../middleware/multer.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.controller.js";

const router = express.Router();

const validateJobRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  return next();
};

// Recruiter only
router
  .route("/post")
  .post(
    authenticateToken,
    authorizeRoles("Recruiter"),
    singleUpload,
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("requirements")
      .trim()
      .notEmpty()
      .withMessage("Requirements are required"),
    body("salary").trim().notEmpty().withMessage("Salary is required"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("jobType").trim().notEmpty().withMessage("jobType is required"),
    body("experience").trim().notEmpty().withMessage("Experience is required"),
    body("position").trim().notEmpty().withMessage("Position is required"),
    body("companyId").trim().notEmpty().withMessage("companyId is required"),
    validateJobRequest,
    postJob
  );
router
  .route("/getadminjobs")
  .get(authenticateToken, authorizeRoles("Recruiter"), getAdminJobs);

// Authenticated users (students, recruiters, admins) can browse jobs
router.route("/get").get(authenticateToken, getAllJobs);
router.route("/get/:id").get(authenticateToken, getJobById);

export default router;