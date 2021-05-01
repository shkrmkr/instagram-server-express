import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from './auth';
import { PORT } from './config/config';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
