import mongoose, { Schema } from "mongoose";

const CompanySchema = new Schema(
  {
    employerId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true },
    logo: { type: String }, // URL or local path to company logo
    description: { type: String, required: true },
    website: { type: String },
    industry: { type: String, required: true },
    location: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Company || mongoose.model("Company", CompanySchema);
