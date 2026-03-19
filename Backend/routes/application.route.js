import express from "express";

import authenticateToken from "../middleware/isAuthenticated.js";
import { authorizeRoles } from "../middleware/roleAuthorization.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";

const router = express.Router();

router.route("/apply/:id").post(authenticateToken, applyJob);
router.route("/get").get(authenticateToken, getAppliedJobs);
router
  .route("/:id/applicants")
  .get(authenticateToken, authorizeRoles("Recruiter"), getApplicants);
router
  .route("/status/:id/update")
  .post(authenticateToken, authorizeRoles("Recruiter"), updateStatus);

export default router;