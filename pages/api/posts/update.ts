import { NextApiRequest, NextApiResponse } from 'next';
import omit from 'lodash.omit';

import prisma from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data = req.body;
  try {
    const result = await prisma.post.update({ data: omit(data, 'id'), where: { id: data.id } });
    res.json(result);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
}