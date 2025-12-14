const validator = require('validator');

// Validate Kenyan phone number
exports.isValidPhone = (phone) => {
  // Accept both formats: 0722222222 and +254722222222
  const regex1 = /^(07|01)\d{8}$/; // 07xx or 01xx format
  const regex2 = /^\+254(7|1)\d{8}$/; // +254 format
  return regex1.test(phone) || regex2.test(phone);
};

// Validate email
exports.isValidEmail = (email) => {
  return validator.isEmail(email);
};

// Validate password strength
exports.isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
  return regex.test(password);
};

// Validate coordinates
exports.isValidCoordinate = (coord) => {
  return Array.isArray(coord) && 
         coord.length === 2 && 
         !isNaN(coord[0]) && 
         !isNaN(coord[1]) &&
         coord[0] >= -180 && coord[0] <= 180 &&
         coord[1] >= -90 && coord[1] <= 90;
};

// Validate vehicle plate number (Kenyan format)
exports.isValidPlateNumber = (plate) => {
  const regex = /^[A-Z]{3}\s\d{3}[A-Z]$/;
  return regex.test(plate);
};

// Validate M-Pesa transaction code
exports.isValidMpesaCode = (code) => {
  const regex = /^[A-Z0-9]{10}$/;
  return regex.test(code);
};

// Validate reservation code
exports.isValidReservationCode = (code) => {
  const regex = /^RES\d+$/;
  return regex.test(code);
};