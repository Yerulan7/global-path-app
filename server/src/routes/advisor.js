import { Router } from 'express';
import { buildSystemPrompt, getStubProfile } from '../services/prompt.js';
import { streamAdvisorReply } from '../services/anthropic.js';

const router = Router();

// TODO: add requireAuth + per-user rate limit before deploying. Local only for now.
router.post('/chat', async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages required' });
  }

  const profile = getStubProfile(); // TODO: load by authenticated user
  const system = buildSystemPrompt(profile);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  streamAdvisorReply({
    system,
    messages,
    onText:  (delta) => res.write(`data: ${JSON.stringify({ delta })}\n\n`),
    onEnd:   ()      => { res.write('data: [DONE]\n\n'); res.end(); },
    onError: ()      => { res.write(`data: ${JSON.stringify({ error: true })}\n\n`); res.end(); },
  });

  req.on('close', () => res.end());
});

export default router;
