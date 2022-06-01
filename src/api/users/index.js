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
        createError(
          404,
          `BlogPosts with id ${req.params.blogPostsId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.put("/:blogPostsId", async (req, res, next) => {
  try {
    const updatedBlogPosts = await BlogpostsModel.findByIdAndUpdate(
      req.params.blogPostsId, // WHO
      req.body, // HOW
      { new: true, runValidators: true } // OPTIONS. By default findByIdAndUpdate returns the record pre-modification. If you want to get back the newly updated record you should use the option: new true
      // By default validation is off here --> runValidators: true
    );

    if (updatedBlogPosts) {
      res.send(updatedBlogPosts);
    } else {
      next(
        createError(
          404,
          `BlogPosts with id ${req.params.blogPostsId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.delete("/:blogPostsId", async (req, res, next) => {
  try {
    const deletedBlogPosts = await BlogpostsModel.findByIdAndDelete(
      req.params.blogPostsId
    );
    if (deletedBlogPosts) {
      res.status(204).send();
    } else {
      next(
        createError(
          404,
          `BlogPosts with id ${req.params.blogPostsId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.post("/:blogPostsId/comments", async (req, res, next) => {
  try {
    const blogComments = await BlogpostsModel.findById(req.params.blogPostsId, {
      _id: 0
    });
    if (blogComments) {
      const commentToInsert = {
        ...blogComments.toObject(),
        commentDate: new Date(),
        ...req.body
      };
      const updatedBlogPosts = await BlogpostsModel.findByIdAndUpdate(
        req.params.blogPostsId, // WHO
        { $push: { comments: commentToInsert } }, // HOW
        { new: true, runValidators: true } // OPTIONS. By default findByIdAndUpdate returns the record pre-modification. If you want to get back the newly updated record you should use the option: new true
        // By default validation is off here --> runValidators: true
      );
      res.send(updatedBlogPosts);
    } else {
      next(
        createError(
          404,
          `BlogPosts with id ${req.params.blogPostsId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/:blogPostsId/comments", async (req, res, next) => {
  try {
    const blogPosts = await BlogpostsModel.findById(req.params.blogPostsId, {
      _id: 0,
      comments: 1
    });
    if (blogPosts) {
      res.send(blogPosts.comments);
    } else {
      next(
        createError(
          404,
          `BlogPosts with id ${req.params.blogPostsId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get(
  "/:blogPostsId/comments/:commentId",
  async (req, res, next) => {
    try {
      const blogPosts = await BlogpostsModel.findById(req.params.blogPostsId);
      if (blogPosts) {
        const selectedComment = blogPosts.comments.find(
          (comment) => comment._id.toString() === req.params.commentId
        );
        if (selectedComment) {
          res.send(selectedComment);
        } else {
          next(
            createError(
              404,
              `Comment with id ${req.params.commentId} not found!`
            )
          );
        }
      } else {
        next(
          createError(
            404,
            `BlogPosts with id ${req.params.blogPostsId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

blogPostsRouter.put(
  "/:blogPostsId/comments/:commentId",
  async (req, res, next) => {
    try {
      const blogPosts = await BlogpostsModel.findById(req.params.blogPostsId);
      if (blogPosts) {
        const index = blogPosts.comments.findIndex(
          (comment) => comment._id.toString() === req.params.commentId
        );
        if (index !== -1) {
          blogPosts.comments[index] = {
            ...blogPosts.comments[index],
            ...req.body
          };
          const updatedBlogPosts = await blogPosts.save();
          res.send(updatedBlogPosts);
        } else {
          next(
            createError(
              404,
              `Comment with id ${req.params.commentId} not found!`
            )
          );
        }
      } else {
        next(
          createError(
            404,
            `BlogPosts with id ${req.params.blogPostsId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

blogPostsRouter.delete(
  "/:blogPostsId/comments/:commentId",
  async (req, res, next) => {
    try {
      const blogPosts = await BlogpostsModel.findByIdAndUpdate(
        req.params.blogPostsId,
        {
          $pull: {
            comments: {
              _id: req.params.commentId
            }
          }
        },
        { new: true }
      );
      if (blogPosts) {
        res.status(204).send();
      } else {
        next(
          createError(
            404,
            `BlogPosts with id ${req.params.blogPostsId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default blogPostsRouter;
