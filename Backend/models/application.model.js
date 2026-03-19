import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: String, // resume URL (Cloudinary/S3)
    },
    status: {
      type: String,
      enum: [
        "applied",
        "viewed",
        "shortlisted",
        "interview",
        "rejected",
        "hired",
      ],
      default: "applied",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// prevent duplicate applications for same job by same user
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);