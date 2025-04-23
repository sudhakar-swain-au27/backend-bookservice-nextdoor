const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user.model');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
        user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id
        });
        await user.save();
    }
    done(null, user);
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/auth/facebook/callback"
}, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ facebookId: profile.id });
    if (!user) {
        user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            facebookId: profile.id
        });
        await user.save();
    }
    done(null, user);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
