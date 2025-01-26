
const express = require('express');
const router = express.Router();
const { Patient } = require('../models/model')
const authMiddleware = require('../middleware/authMiddleware'); 

router.post('/',authMiddleware, async (req, res) => {
  try {
    const { name, gender, age,symptoms, irisImage } = req.body; 
    const newPatient = new Patient({ 
      name, 
      gender, 
      age,
      symptoms, 
      irisImage, 
      operator: req.user._id 
    });
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (err) {
    console.error(err); 
    res.status(400).json({ error: 'Failed to create patient.' }); 
  }
});

router.get('/', authMiddleware, async (req, res) => { 
  try {
    const patients = await Patient.find(); 
    res.json(patients); 
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'Failed to retrieve patients.' }); 
  }
});

router.get('/:id', authMiddleware, async (req, res) => { 
  try {
    const patient = await Patient.findById(req.params.id); 
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }
    res.json(patient); 
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'Failed to retrieve patient.' }); 
  }
});

router.put('/:id', authMiddleware, async (req, res) => { 
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true }); 
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }
    res.json(patient); 
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'Failed to update patient.' }); 
  }
});

router.delete('/:id', authMiddleware, async (req, res) => { 
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id); 
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }
    res.json({ message: 'Patient deleted successfully.' }); 
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'Failed to delete patient.' }); 
  }
})

module.exports = router;
