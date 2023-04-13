import { NextApiRequest, NextApiResponse } from 'next';
import { Order } from '@prisma/client';

import prisma from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data = req.body as Order;
  const { id, history, ...rest } = data;
  try {
    const result = await prisma.order.update({
      data: { ...rest, history: history || undefined },
      where: { id },
    });
    res.json(result);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
}