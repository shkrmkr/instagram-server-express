import { body, checkSchema, CustomValidator } from 'express-validator';
import { prisma } from '../config/prisma';

const isEmailNotInUse: CustomValidator = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    return Promise.reject('Email already in use.');
  }
};

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email.')
    .custom(isEmailNotInUse),
  body('password')
    .isString()
    .withMessage('Password must be a string.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
];

export const signupValidations = checkSchema({
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Must be a valid email address',
    },
    trim: true,
  },
});
