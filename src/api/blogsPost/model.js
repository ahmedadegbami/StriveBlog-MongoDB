import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number },
      unit: { type: String }
    },

    comments: [{ text: String, rate: String, commentDate: Date }],

    content: { type: String, required: true }
  },
  { timestamps: true } // adds and manages automatically createdAt and updatedAt fields
);

export default model("BlogsPosts", blogPostsSchema); // this model is now automatically linked to the "users" collection, if the collection is not there it will be automatically created
