import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { login, pass } = req.body;

  if (login === process.env.NEXT_PUBLIC_LOGIN && pass === process.env.NEXT_PUBLIC_PASSWORD) {
    const token = jwt.sign(
      { user: login },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: 12 * 60 * 60 }
    );
    setCookie('auth', token, { req, res, maxAge: 12 * 60 * 60 });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: 'Access denied' });
  }
}