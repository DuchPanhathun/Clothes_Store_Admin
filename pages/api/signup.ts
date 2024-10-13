import type { NextApiRequest, NextApiResponse } from 'next';
import { signUp } from '../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const user = await signUp(email, password);
      res.status(200).json({ message: 'User created successfully', userId: user.uid });
    } catch (error: any) {
      console.error('Signup error:', error);
      res.status(500).json({ error: error.message || 'An error occurred during signup' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
