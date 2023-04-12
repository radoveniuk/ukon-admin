import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client';
import omit from 'lodash.omit';

import prisma from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data = req.body as User;
  const { id, address, country, ...rest } = data;
  try {
    const result = await prisma.user.update({
      data: { ...rest, address: address || undefined, country: country || undefined },
      where: { id },
    });
    res.json(omit(result, 'pass'));
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
}