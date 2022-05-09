import passport from "passport";
import dotenv from "dotenv";
import strategy from "passport-facebook";

// import userModel from "../user/user.model";

const FacebookStrategy = strategy.Strategy;

dotenv.config();
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "name"]
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      const { email, first_name, last_name } = profile._json;
      done(null, profile);
    }
  )
);
