import express from "express";
import createError from "http-errors";
import authorModel from "./model.js";

const authorRouter = express.Router();

authorRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new authorModel(req.body); // here it happens the validation of req.body, if it is not ok Mongoose will throw an error (if it is ok it is NOT saved yet)
    const { _id } = await newAuthor.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

authorRouter.get("/", async (req, res, next) => {
  try {
    const authors = await authorModel.find();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorRouter.get("/:authorId", async (req, res, next) => {
  try {
    const author = await authorModel.findById(req.params.authorId);
    if (author) {
      res.send(author);
    } else {
      next(
        createError(404, `Author with id ${req.params.authorId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

authorRouter.put("/:authorId", async (req, res, next) => {
  try {
    const updatedAuthor = await authorModel.findByIdAndUpdate(
      req.params.authorId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedAuthor) {
      res.send(updatedAuthor);
    } else {
      next(
        createError(404, `Author with id ${req.params.authorId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

authorRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const deletedAuthor = await authorModel.findByIdAndDelete(
      req.params.authorId
    );
    if (deletedAuthor) {
      res.send(deletedAuthor);
    } else {
      next(
        createError(404, `Author with id ${req.params.authorId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default authorRouter;
