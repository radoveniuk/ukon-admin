import { NextApiRequest, NextApiResponse } from 'next';

// import { VirtualAddress } from '@prisma/client';
import prisma from 'lib/prisma';
// TODO FIX
const createMailbox = async (data: any) => {
  const result = await prisma.virtualAddress.create({ data, include: { user: true } });
  return result;
};

const updateMailbox = async (data: any) => {
  const result = await prisma.virtualAddress.update({ data, where: { id: data.id } });
  return result;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const method = req.method.toLowerCase();
    if (method === 'post') {
      const data = req.body;
      const result = await createMailbox(data);
      res.status(200).json(result);
    }
    if (method === 'put') {
      const data = req.body;
      const result = await updateMailbox(data);
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}