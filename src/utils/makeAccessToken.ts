import { User } from '.prisma/client';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_SECRET } from '../config/config';

export const makeAccessToken = (user: User) =>
  jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
