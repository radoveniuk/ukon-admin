import { NextApiRequest, NextApiResponse } from 'next';

import prisma from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data = req.body;
  try {
    const result = await prisma.post.create({ data });
    res.json(result);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
}