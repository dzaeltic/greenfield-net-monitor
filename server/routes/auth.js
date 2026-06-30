const process = require('node:process');
const express = require('express');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../db/schemas/users');

const router = express.Router();

require('dotenv').config({ path: path.join('config', '.env') });

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne(
    { googleId: id },
  )
    .then((user) => done(null, user))
    .catch((err) => {
      console.error('Could not deserialize user:', err);
      return done(err, null);
    });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/oauth2/redirect/google',
      scope: ['profile', 'email'],
    },

    // { id: profile.id ,
    // displayName: profile.displayName,
    // emails: profile.emails[0].value }
    (accessToken, refreshToken, profile, done) => {
      User.findOneAndUpdate(
        { googleId: profile.id },
        {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
        },
        // replaced deprecated value
        { upsert: true, returnDocument: 'after' },
      )
        .then((user) => done(null, user))
        .catch((err) => {
          console.error('Error cannot find user:', err);
          return done(err, null);
        });
    },
  ),
);

router.get('/login', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/redirect/google', passport.authenticate('google', {
  failureRedirect: '/login',
  successRedirect: '/',
}));

module.exports = router;
