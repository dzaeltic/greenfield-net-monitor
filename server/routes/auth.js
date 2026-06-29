const process = require('node:process');
const express = require('express');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../db/schemas/users');

const router = express.Router();

require('dotenv').config({ path: path.join('config', '.env') });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/oauth2/redirect/google',
    },

    // { id: profile.id ,
    // displayName: profile.displayName,
    // emails: profile.emails[0].value }
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id })
        .then((user) => {
          console.info('Found user:');
          return done(null, user);
        })
        .catch((err) => {
          console.error('Error cannot find user:', err);
          return done(err, null);
        });
    },
  ),
);

router.get(
  '/login',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

router.get('/redirect/google', passport.authenticate('google', {
  failureRedirect: '/login',
}));

module.exports = router;
