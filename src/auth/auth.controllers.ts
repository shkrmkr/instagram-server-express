import argon2 from 'argon2';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET, TOKEN_COOKIE_OPTIONS } from '../config/config';
import { prisma } from '../config/prisma';
import { LoginInput, RefreshTokenPayload, SignupInput } from './auth.types';
import { makeAccessToken, makeRefreshToken } from './auth.utils';

export const signup: RequestHandler = async (req, res) => {
  const { email, username, fullName, password } = req.body as SignupInput;

  const isUsernameInUse = await prisma.user.findUnique({ where: { username } });

  if (isUsernameInUse) {
    return res.status(409).send({
      field: 'username',
      message: "This username isn't available. Please try another.",
    });
  }

  const isEmailInUse = await prisma.user.findUnique({ where: { email } });

  if (isEmailInUse) {
    return res.status(409).send({
      field: 'username',
      message: `Another account is using ${email}.`,
    });
  }

  try {
    const hashedPassword = await argon2.hash(password, { saltLength: 12 });
    const user = await prisma.user.create({
      data: { email, username, fullName, password: hashedPassword },
    });
    return res.send({ user });
  } catch (error) {
    return res
      .status(500)
      .send({ message: 'Somthing went wrong. Please try again later.' });
  }
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body as LoginInput;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(400).send({
      field: 'email',
      message:
        "The email you entered doesn't belong to an account. Please check your email and try again.",
    });
  }

  const isPasswordValid = await argon2.verify(user.password, password);

  if (!isPasswordValid) {
    return res.status(400).send({
      field: 'password',
      message:
        'Sorry, your password was incorrect. Please double-check your password.',
    });
  }

  const accessToken = makeAccessToken({ userId: user.id });
  const refreshToken = makeRefreshToken({
    userId: user.id,
    tokenVersion: user.tokenVersion,
  });

  res.cookie('sid', refreshToken, TOKEN_COOKIE_OPTIONS).send({ accessToken });
};

export const refresh: RequestHandler = async (req, res) => {
  const { sid } = req.cookies;

  if (!sid) {
    return res.status(401).send({ message: 'Unauthorized.' });
  }

  try {
    const { userId, tokenVersion } = jwt.verify(
      sid,
      REFRESH_TOKEN_SECRET,
    ) as RefreshTokenPayload;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(401).send({ message: 'Unauthorized.' });
    }

    if (user.tokenVersion !== tokenVersion) {
      return res.status(401).send({ message: 'Unauthorized.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { tokenVersion: { increment: 1 } },
    });

    const refreshToken = makeRefreshToken({
      userId: updatedUser.id,
      tokenVersion: updatedUser.tokenVersion,
    });
    const accessToken = makeAccessToken({ userId: updatedUser.id });

    res.cookie('sid', refreshToken, TOKEN_COOKIE_OPTIONS).send({ accessToken });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Somthing went wrong. Please try again later.' });
  }
};
