const process = require('node:process');
const express = require('express');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Users } = require('../db');

const router = express.Router();

require('dotenv').config({ path: path.join('config', '.env') });

passport.serializeUser((user, done) => {
  done(null, user.googleId);
});

passport.deserializeUser((id, done) => {
  Users.findOne(
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

    (accessToken, refreshToken, profile, done) => {
      Users.findOneAndUpdate(
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

router.get('/dev/login', (req, res) => {
  Users.findOne({ googleId: '101463606319803782948' })
    .then((user) => {
      req.login(user, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'logged in', user });
      });
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
