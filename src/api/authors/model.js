import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authorsSchema = new Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String }
  },
  { timestamps: true }
);

export default model("Author", authorsSchema);
