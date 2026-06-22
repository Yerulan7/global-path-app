import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export function streamAdvisorReply({ system, messages, onText, onEnd, onError }) {
  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system,
    messages,
  });
  stream.on('text', onText);
  stream.on('end', onEnd);
  stream.on('error', onError);
  return stream;
}
