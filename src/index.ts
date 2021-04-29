import express from 'express';
import authRoutes from './auth';
import { PORT } from './config/environment-variables';

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
