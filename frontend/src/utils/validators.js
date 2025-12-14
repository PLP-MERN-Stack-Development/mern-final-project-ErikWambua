// Validation utility functions
import { VALIDATION } from './constants';

export const validateEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

export const validatePhone = (phone) => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

export const validatePassword = (password) => {
  return password && password.length >= VALIDATION.MIN_PASSWORD_LENGTH;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateRequired
};
