const jwt = require('jsonwebtoken');
const { Doctor, Operator } = require('../models/model'); 
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    if (decoded.userType === 'doctor') { 
      req.user = await Doctor.findById(decoded.userId); 
    } else if (decoded.userType === 'operator') { 
      req.user = await Operator.findById(decoded.userId); 
    } else { 
      return res.status(401).json({ error: 'Invalid user type.' }); 
    }

    if (!req.user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    next();
  } catch (err) {
    console.error(err); 
    return res.status(401).json({ error: 'Unauthorized.' });
  }
};

module.exports = authMiddleware;