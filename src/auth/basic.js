import createHttpError from "http-errors";
import atob from "atob";
import UserModel from "../api/users/model.js";

export const basicAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "No authorization header, please provide credentials"
      )
    );
  } else {
    const auth = req.headers.authorization.split(" ")[1];
    const [email, password] = atob(auth).split(":");
    const user = await UserModel.checkCredentials(email, password);
    if (user) {
      req.user = user;
      next();
    } else {
      next(createHttpError(401, "Invalid credentials"));
    }
  }
};
