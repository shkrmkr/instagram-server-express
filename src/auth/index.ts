import { Router } from 'express';
import { me, signup } from './auth.controllers';
import { validateLogin } from './auth.validation';

const authRoutes = Router();

authRoutes.get('/:id', me);
authRoutes.post('/signup', validateLogin, signup);

export default authRoutes;
