import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateTestCases } from '../src/testCases.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { aiType, ageGroup, count } = req.body as {
      aiType: 'learning' | 'emotional' | 'campus';
      ageGroup: '6-12' | '13-15' | '16-18';
      count: 10 | 30;
    };

    if (!aiType || !ageGroup || !count) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const cases = generateTestCases(aiType, ageGroup, count);

    return res.status(200).json({
      success: true,
      data: cases,
      count: cases.length,
    });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
