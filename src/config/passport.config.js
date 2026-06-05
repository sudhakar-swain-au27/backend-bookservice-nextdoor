import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/user.model.js";

const hasGoogleOAuth = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
const hasFacebookOAuth = process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET;

if (hasGoogleOAuth) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/v1/users/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = new User({
            name: profile.displayName,
              email: profile.emails?.[0]?.value,
              googleId: profile.id,
          });
              await user.save();
          }
          done(null, user);
        }
    )
  );
} else {
    console.warn("Google OAuth is disabled because GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not set.");
}

if (hasFacebookOAuth) {
    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "http://localhost:5000/api/v1/users/facebook/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            let user = await User.findOne({ facebookId: profile.id });
            if (!user) {
                user = new User({
            name: profile.displayName,
              email: profile.emails?.[0]?.value,
              facebookId: profile.id,
          });
              await user.save();
          }
          done(null, user);
        }
    )
  );
} else {
    console.warn("Facebook OAuth is disabled because FACEBOOK_APP_ID / FACEBOOK_APP_SECRET are not set.");
}

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
