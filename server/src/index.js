import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'global-path-server', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
