import mongoose, { model, models, Schema } from "mongoose";
import bcryptjs from "bcryptjs";

const DesignSchema = new Schema(
  {
    designType: String,
    designs: { type: Array },
  },
  { timestamps: true }
);

const Design = models.Design || model("Design", DesignSchema);
export default Design;
