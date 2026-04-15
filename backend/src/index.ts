import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api', apiRoutes);

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Backend listening at http://0.0.0.0:${port}`);
});
