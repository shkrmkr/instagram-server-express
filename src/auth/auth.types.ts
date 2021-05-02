import { User as PrismaUser } from '.prisma/client';
import { Exclude } from 'class-transformer';

export type SignupInput = Omit<PrismaUser, 'id' | 'createdAt'>;

export type LoginInput = Pick<PrismaUser, 'email' | 'password'>;

export interface AccessTokenPayload {
  userId: PrismaUser['id'];
}

export interface RefreshTokenPayload {
  userId: PrismaUser['id'];
  tokenVersion: PrismaUser['tokenVersion'];
}

export class User implements PrismaUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  @Exclude() password: string;
  createdAt: Date;
  @Exclude() tokenVersion: number;
}
