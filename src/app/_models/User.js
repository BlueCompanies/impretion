import mongoose, { model, models, Schema } from "mongoose";
import bcryptjs from "bcryptjs";

const UserSchema = new Schema(
  {
    email: String,
    password: { type: String, select: false },
    name: { type: String },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

// Hash passwords before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcryptjs.genSalt(12);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

// Compare passwords
UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcryptjs.compare(password, this.password);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const User = models.User || model("User", UserSchema);
export default User;
