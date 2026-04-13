import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateScript } from './api/generate-script';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Script generation endpoint
app.post('/api/generate-script', generateScript);

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
