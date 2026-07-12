import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import db, { connectDB } from './config/db.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { startCronJobs } from './utils/cron.js';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*';
app.use(cors({ origin: allowedOrigins }));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});


// API Routes
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorHandler);

await connectDB();

startCronJobs();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
