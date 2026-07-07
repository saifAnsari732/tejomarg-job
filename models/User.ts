import mongoose, { Schema } from "mongoose";

const ExperienceSchema = new Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., "Jan 2024 - Present" or "2 years"
  description: { type: String },
});

const EducationSchema = new Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  year: { type: String, required: true }, // e.g., "2024"
});

const CandidateProfileSchema = new Schema({
  skills: [{ type: String }],
  experience: [ExperienceSchema],
  education: [EducationSchema],
  resumeUrl: { type: String },
  avatarUrl: { type: String },
  expectedSalary: { type: Number },
  preferredLocation: { type: String },
  mobile: { type: String },
  dob: { type: String },
  gender: { type: String },
  homeTown: { type: String },
  totalExperience: { type: String },
  noticePeriod: { type: String },
  highestEducation: { type: String },
  schoolMedium: { type: String },
  furtherEducationPrefs: [{ type: String }],
  certifications: [{ name: { type: String } }],
  languages: [{ type: String }],
  spokenEnglishLevel: { type: String },
  preferredJobTitles: [{ type: String }],
});

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["admin", "employer", "candidate"],
      default: "candidate",
    },
    candidateProfile: { type: CandidateProfileSchema, default: () => ({}) },
    savedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent mongoose from compiling the model multiple times during next dev hot reloading
export default mongoose.models.User || mongoose.model("User", UserSchema);
