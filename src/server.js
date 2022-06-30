import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import blogPostsRouter from "./api/blogPosts/index.js";
import authorsRouter from "./api/authors/index.js";
import userRouter from "./api/users/index.js";
import {
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
  notFoundHandler
} from "./errorHandlers.js";

const server = express();
const port = process.env.PORT || 3001;

// ****************************************************** MIDDLEWARES **********************************************

server.use(cors());
server.use(express.json());

// ******************************************************* ENDPOINTS ***********************************************

server.use("/blogPosts", blogPostsRouter);
server.use("/authors", authorsRouter);
server.use("/users", userRouter);

// ***************************************************** ERROR HANDLERS ********************************************

server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllHandler);
server.use(notFoundHandler);

mongoose.connect(process.env.MONGO_CONNECTION_URL);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
