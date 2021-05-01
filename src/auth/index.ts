import { Router } from 'express';
import { login, refresh, signup } from './auth.controllers';

const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.get('/refresh', refresh);

export default authRoutes;
