import { NextApiRequest, NextApiResponse } from 'next';

import prisma from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.body;
  try {
    const result = await prisma.post.delete({ where: { id } });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}