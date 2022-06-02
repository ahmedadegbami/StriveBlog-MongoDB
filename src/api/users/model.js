import mongoose from "mongoose";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  { timestamps: true }
);

export default model("User", usersSchema);
