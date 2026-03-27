import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    // Verify Google access token via Google userinfo API (same approach as client app)
    const googleRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    const { email, name } = googleRes.data;

    if (!email) {
      return res.status(401).json({ error: 'Could not retrieve email from Google' });
    }

    // Check if the email is in the allowed list
    const allowedEmails = (process.env.ALLOWED_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase());

    if (!allowedEmails.includes(email.toLowerCase())) {
      return res.status(403).json({ error: 'Access denied. This account is not allowed.' });
    }

    // Issue JWT
    const authToken = jwt.sign(
      { email, name },
      process.env.JWT_SECRET,
      { expiresIn: 12 * 60 * 60 }
    );

    setCookie('auth', authToken, { req, res, maxAge: 12 * 60 * 60 });
    res.status(200).json({ token: authToken, email, name });
  } catch (error) {
    console.error('Google auth error:', error?.response?.data || error.message);
    res.status(401).json({ error: 'Invalid Google token' });
  }
}
