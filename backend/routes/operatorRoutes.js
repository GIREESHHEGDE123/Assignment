// operatorRoutes.js

const express = require('express');
const router = express.Router();
const { Operator } = require('../models/model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => { 
  try {
    const { name, email, password } = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10);
    const newOperator = new Operator({ name, email, password: hashedPassword }); 
    const savedOperator = await newOperator.save();
    res.status(201).json(savedOperator);
  } catch (err) {
    console.error(err); 
    res.status(400).json({ error: 'Failed to create operator.' }); 
  }
});

router.post('/login', async (req, res) => { 
  try {
    const { email, password } = req.body;
    const operator = await Operator.findOne({ email }); 
    if (!operator) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const passwordMatch = await bcrypt.compare(password, operator.password); 
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: operator._id, userType: 'operator' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token:token, id: operator._id });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'Login failed.' }); 
  }
});

module.exports = router;
