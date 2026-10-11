const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();

const credentialsSchema = Joi.object({
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().min(8).max(72).required(),
});

const createToken = (user) =>
  jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

router.post('/register', async (req, res) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Authentication is not configured' });
  }

  const { error, value } = credentialsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const passwordHash = await bcrypt.hash(value.password, 12);
    const user = await User.create({ email: value.email, passwordHash });
    const token = createToken(user);

    return res.status(201).json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    return res.status(500).json({ message: 'Unable to register account' });
  }
});

router.post('/login', async (req, res) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Authentication is not configured' });
  }

  const { error, value } = credentialsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await User.findOne({ email: value.email }).select('+passwordHash');

    if (!user || !(await bcrypt.compare(value.password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createToken(user);

    return res.status(200).json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to log in' });
  }
});

module.exports = router;