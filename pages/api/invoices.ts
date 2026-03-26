import { NextApiRequest, NextApiResponse } from 'next';

import prisma from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const invoices = await prisma.generatedInvoice.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
