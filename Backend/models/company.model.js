import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  logo: {
    type: String // URL to company logo
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Ensure company names are unique per recruiter (userId) only
companySchema.index({ userId: 1, name: 1 }, { unique: true });
export const Company = mongoose.model("Company", companySchema);