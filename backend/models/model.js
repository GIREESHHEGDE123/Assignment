const mongoose = require('mongoose');

const operatorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const doctorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  age: { type: Number, min: 0, required: true },
  symptoms: { type: String, required: true },
  irisImage: { type: String, required: false }, // Single field for the iris image
  operator: { type: mongoose.Schema.Types.ObjectId, ref: 'Operator', required: true }, // Associated operator ID
  diagnoses: [
    {
      doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
      diagnosis: { type: String, required: true }
    }
  ]
});



module.exports = { 
  Operator: mongoose.model('Operator', operatorSchema), 
  Doctor: mongoose.model('Doctor', doctorSchema), 
  Patient: mongoose.model('Patient', patientSchema) 
};