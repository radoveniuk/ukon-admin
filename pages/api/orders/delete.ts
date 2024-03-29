import { NextApiRequest, NextApiResponse } from 'next';

// import { Order } from '@prisma/client';
// TODO FIX
import prisma from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data = req.body;
  const { id } = data;
  try {
    const result = await prisma.order.delete({
      where: { id },
    });
    res.json(result);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
}