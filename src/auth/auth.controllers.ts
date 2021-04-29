import argon2 from 'argon2';
import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../config/prisma';
import { SignupInput } from './auth.types';

export const me: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return res.status(404).send({ message: 'user not found' });
  }

  return res.send({ user });
};

export const signup: RequestHandler = async (req, res) => {
  const { email, password } = req.body as SignupInput;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  try {
    const hashedPassword = await argon2.hash(password, { saltLength: 12 });
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    return res.send({ user });
  } catch (error) {
    return res.status(500).send('somthing went wrong.');
  }
};
