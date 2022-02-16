import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  avatar: String,
  username: { type: String, required: true, unique: true },
  socialOnly: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  region: String,
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
