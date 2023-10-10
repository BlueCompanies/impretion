import { model, models, Schema } from "mongoose";

const UnorderedDesignSchema = new Schema(
  {
    url: { type: String },
    description: { type: String },
    type: { type: String },
    tags: { type: String },
  },
  { timestamps: true }
);

const UnorderedDesign =
  models.UnorderedDesign || model("UnorderedDesign", UnorderedDesignSchema);
export default UnorderedDesign;
