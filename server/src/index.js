import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import advisorRouter from './routes/advisor.js';
import programsRouter from './routes/programs.js';

const app = express();
const PORT = process.env.PORT || 3001;
const ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'global-path-server', time: new Date().toISOString() });
});

app.use('/api/advisor', advisorRouter);
app.use('/api/programs', programsRouter);

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
