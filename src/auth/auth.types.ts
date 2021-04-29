import { Prisma } from '.prisma/client';

export type SignupInput = Pick<Prisma.UserCreateInput, 'email' | 'password'>;
