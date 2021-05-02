import { Router } from 'express';
import { login, logout, refresh, signup } from './auth.controllers';

const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.get('/refresh', refresh);
authRoutes.get('/logout', logout);

export default authRoutes;
