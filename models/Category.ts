import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, required: true }, // lucide icon name
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
