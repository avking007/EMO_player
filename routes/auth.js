const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/default');
const auth = require('../middleware/auth');

const router = express.Router();

// route : /user/
// access : private
// desc : get user by user_id
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
});

// route : /user/signup
// access : public
// desc : new user signup
router.post(
  '/signup',
  [
    check('first_name', 'First name is required.').not().isEmpty(),
    check('last_name', 'Last name is required.').not().isEmpty(),
    check('email', 'Email is required.').not().isEmpty(),
    check('email', 'Provide a valid email.').isEmail(),
    check('password', 'Password is required.').not().isEmpty(),
  ],
  async (req, res) => {
    try {
      // check request body for missing/invalid data
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // get data from request body
      let { first_name, last_name, email, password } = req.body;

      // check for already existing user
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: ['User already exists.'] });
      }

      // create new user
      user = { first_name, email, last_name };

      // create hash password
      const salt = await bcrypt.genSalt(10);
      const hashed_password = await bcrypt.hash(password, salt);

      user.password = hashed_password;

      // store user in mongoDB
      const newUser = new User(user);
      await newUser.save();

      // create payload for jwt
      const payload = {
        user: {
          id: newUser.id,
        },
      };

      // sign the payload and send token as response
      jwt.sign(
        payload,
        config.jwtKey,
        {
          expiresIn: '6h',
        },
        (err, token) => {
          if (err) throw err;
          return res.json({ token });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).send('Server Error');
    }
  }
);

// route: user/login
// access: public
// desc: login user
router.post(
  '/login',
  [
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Enter a valid email.').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let { email, password } = req.body;

      //  check whether user exists or not
      const user = await User.findOne({ email });
     
      if (!user) {
        return res.status(500).json({ errors: ['User does not exists.'] });
      }

      //   if user exits, compare hash password and input password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).send('Invalid email or password');
      }

      //  if user is valid, create payload and send jwt token
      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(
        payload,
        config.jwtKey,
        {
          expiresIn: '6h',
        },
        (err, token) => {
          if (err) throw err;
          return res.json({ token });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
