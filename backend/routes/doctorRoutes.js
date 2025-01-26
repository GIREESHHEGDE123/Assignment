// doctorRoutes.js

const express = require("express");
const router = express.Router();
const { Doctor, Patient } = require("../models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new Doctor({ name, email, password: hashedPassword });
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to register doctor." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const passwordMatch = await bcrypt.compare(password, doctor.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const token = jwt.sign(
      { userId: doctor._id, userType: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token: token, id: doctor._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed." });
  }
});

router.get("/operators", authMiddleware, async (req, res) => {
  try {
    const operators = await Operator.find();
    res.json(operators);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve operators." });
  }
});
router.put("/diagnoses/:id", authMiddleware, async (req, res) => {
  try {
    const { diagnosis } = req.body;

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }
    const newDiagnosis = {
      doctor: req.user._id,
      diagnosis,
    };

    patient.diagnoses.push(newDiagnosis);
    await patient.save();

    res.status(200).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add diagnosis." });
  }
});
module.exports = router;
