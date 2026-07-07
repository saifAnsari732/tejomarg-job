import mongoose, { Schema } from "mongoose";

const JobSchema = new Schema(
  {
    employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: [{ type: String }],
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Remote", "Internship"],
      required: true,
    },
    location: { type: String, required: true },
    experienceLevel: {
      type: String,
      enum: ["Entry-level", "Mid-level", "Senior"],
      required: true,
    },
    openings: { type: Number, default: 1 },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "active", "closed"],
      default: "pending",
    },
    category: { type: String, required: true }, // slug or name of category
    experienceYears: { type: Number, default: 0 },
    highestEducation: { type: String },
    workShift: { type: String },
    englishLevel: { type: String },
    genderPreference: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
