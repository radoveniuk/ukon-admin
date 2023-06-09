import { NextApiRequest, NextApiResponse } from 'next';
import omit from 'lodash.omit';

// import { Mail } from '@prisma/client';
import prisma from 'lib/prisma';
// TODO FIX
const createMail = async (data: any) => {
  const result = await prisma.mail.create({ data });
  return result;
};

const updateMail = async (data: any) => {
  const result = await prisma.mail.update({ data: omit(data, 'id'), where: { id: data.id } });
  return result;
};

const deleteMail = async (id: string) => {
  const result = await prisma.mail.delete({ where: { id } });
  return result;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const method = req.method.toLowerCase();
    if (method === 'post') {
      const data = req.body as any;
      const result = await createMail(data);
      res.status(200).json(result);
    }
    if (method === 'put') {
      const data = req.body as any;
      const result = await updateMail(data);
      res.status(200).json(result);
    }
    if (method === 'delete') {
      const data = req.body as any;
      const result = await deleteMail(data.id);
      res.status(200).json(result);
    }
    if (method === 'get') {
      const { virtualAddressId } = req.query as Record<string, string>;
      const data = await prisma.mail.findMany({ where: { virtualAddressId } });
      res.status(200).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}