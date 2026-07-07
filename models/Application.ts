import mongoose, { Schema } from "mongoose";

const StatusHistorySchema = new Schema({
  status: {
    type: String,
    enum: ["applied", "shortlisted", "interview", "rejected", "hired"],
    required: true,
  },
  updatedAt: { type: Date, default: Date.now },
  note: { type: String },
});

const ApplicationSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview", "rejected", "hired"],
      default: "applied",
    },
    statusHistory: [StatusHistorySchema],
  },
  { timestamps: true }
);

// Pre-save hook to populate statusHistory initially
ApplicationSchema.pre("save", function () {
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status,
      updatedAt: new Date(),
      note: "Application submitted successfully.",
    });
  }
});

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
