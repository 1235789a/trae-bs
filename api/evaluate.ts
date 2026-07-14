import { evaluate, DIMENSIONS } from '../src/rules.js';

export default function handler(req: { method: string; body: { answer: string } }, res: { status: (code: number) => { json: (data: unknown) => void } }) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { answer } = req.body;

    if (!answer || typeof answer !== 'string') {
      return res.status(400).json({ error: 'Answer is required' });
    }

    const result = evaluate(answer);

    return res.status(200).json({
      success: true,
      data: result,
      dimensions: DIMENSIONS,
    });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
