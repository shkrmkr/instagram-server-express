import { CookieOptions } from 'express';

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
}

export const PORT = parseInt(process.env.PORT || '4000');
export const REFRESH_TOKEN_EXPIRES_IN = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES_IN || '864000000', // 10 days
);
export const ACCESS_TOKEN_EXPIRES_IN = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES_IN || '600000', // 10 minutes
);
export const IS_IN_PRODUCTION_MODE = process.env.NODE_ENV === 'production';

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  console.error(
    'Environment variable REFRESH_TOKEN_SECRET or/and ACCESS_TOKEN_SECRET is not set.',
  );
  process.exit(1);
}

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  maxAge: REFRESH_TOKEN_EXPIRES_IN,
  secure: IS_IN_PRODUCTION_MODE,
};
