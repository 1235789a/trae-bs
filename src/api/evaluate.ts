import type { VercelRequest, VercelResponse } from '@vercel/node';
import { evaluate, DIMENSIONS } from '../rules.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { answer } = req.body as { answer: string };

    if (!answer || typeof answer !== 'string') {
      return res.status(400).json({ error: 'Answer is required' });
    }

    const result = evaluate(answer);

    return res.status(200).json({
      success: true,
      data: result,
      dimensions: DIMENSIONS,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
