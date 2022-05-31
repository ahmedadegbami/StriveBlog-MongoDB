import express from "express";
import createError from "http-errors";
import BlogpostsModel from "./model.js";

const blogPostsRouter = express.Router();

blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPosts = new BlogpostsModel(req.body); // here it happens the validation of req.body, if it is not ok Mongoose will throw an error (if it is ok it is NOT saved yet)
    const { _id } = await newBlogPosts.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await BlogpostsModel.find();
    res.send(blogPosts);
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/:blogPostsId", async (req, res, next) => {
  try {
    const blogPosts = await BlogpostsModel.findById(req.params.blogPostsId);

    if (blogPosts) {
      res.send(blogPosts);
    } else {
      next(
        createError(404, `User with id ${req.params.blogPostsId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.put("/:userId", async (req, res, next) => {
  try {
    const updatedUser = await BlogpostsModel.findByIdAndUpdate(
      req.params.userId, // WHO
      req.body, // HOW
      { new: true, runValidators: true } // OPTIONS. By default findByIdAndUpdate returns the record pre-modification. If you want to get back the newly updated record you should use the option: new true
      // By default validation is off here --> runValidators: true
    );

    // ***************************************** ALTERNATIVE METHOD **********************************************
    // const user = await UsersModel.findById(req.params.userId) // you get back a MONGOOSE DOCUMENT which is NOT a normal object

    // user.firstName = "John"

    // await user.save()

    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// blogPostsRouter.delete("/:userId", async (req, res, next) => {
//   try {
//     const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId);
//     if (deletedUser) {
//       res.status(204).send();
//     } else {
//       next(createError(404, `User with id ${req.params.userId} not found!`));
//     }
//   } catch (error) {
//     next(error);
//   }
// });

export default blogPostsRouter;
