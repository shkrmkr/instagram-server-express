import { User } from '.prisma/client';

export type SignupInput = Omit<User, 'id' | 'createdAt'>;

export type LoginInput = Pick<User, 'email' | 'password'>;

export interface AccessTokenPayload {
  userId: User['id'];
}

export interface RefreshTokenPayload {
  userId: User['id'];
  tokenVersion: User['tokenVersion'];
}
