import { User } from '.prisma/client';
import jwt from 'jsonwebtoken';
import {
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
} from '../config/config';

export const makeRefreshToken = (user: User) =>
  jwt.sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    },
  );
