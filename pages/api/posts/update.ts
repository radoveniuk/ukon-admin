import { NextApiRequest, NextApiResponse } from 'next';
import omit from 'lodash.omit';
import { DateTime } from 'luxon';

import { DATE_FORMAT } from 'constants/datetime';

import prisma from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data = req.body;
  try {
    const date = DateTime.fromFormat(data.publicationDate, DATE_FORMAT).toISODate();
    const result = await prisma.post.update({ data: { ...omit(data, 'id'), publicationDate: date }, where: { id: data.id } });
    res.json(result);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
}