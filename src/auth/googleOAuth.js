import GoogleStrategy from "passport-google-oauth20";
import UsersModel from "../api/users/model.js";
import { verifyAccessToken } from "./tools.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/users/googleRedirect`
  },
  async (_, __, profile, passportNext) => {
    try {
      const user = await UsersModel.findOne({ email: profile._json.email });

      if (user) {
        const { accessToken, refreshToken } = await verifyAccessToken(user);

        passportNext(null, { accessToken, refreshToken });
      } else {
        const { given_name, family_name, email } = profile._json;

        const newUser = new UsersModel({
          firstName: given_name,
          lastName: family_name,
          email,
          googleID: profile.id
        });
        const createdUser = await newUser.save();
        const { accessToken, refreshToken } = await verifyAccessToken(
          createdUser
        );

        passportNext(null, { accessToken, refreshToken });
      }
    } catch (error) {
      passportNext(error);
    }
  }
);

export default googleStrategy;
