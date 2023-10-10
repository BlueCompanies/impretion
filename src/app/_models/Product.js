import mongoose, { model, models, Schema } from "mongoose";
import bcryptjs from "bcryptjs";

const ProductSchema = new Schema({
  name: String,
  rawName: String,
  measures: { type: Object },
  colors: { type: Array },
  about: String,
  features: { type: Array },
  materials: { type: Array },
  files: { type: Object },
  productData: { type: Object },
  editor: { type: Object },
});

const Product = models.Product || model("Product", ProductSchema);
export default Product;
