import { NextApiRequest, NextApiResponse } from 'next';

import prisma from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { id } = req.query;

    // Single log body fetch
    if (id) {
      const log = await prisma.emailLog.findUnique({
        where: { id: id as string },
        select: { id: true, body: true, subject: true },
      });
      if (!log) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(log);
    }

    // List with pagination + filters
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '50', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.app) where.app = req.query.app;
    if (req.query.emailType) where.emailType = req.query.emailType;
    if (req.query.search) {
      const s = req.query.search as string;
      where.OR = [
        { subject: { contains: s, mode: 'insensitive' } },
        { to: { has: s } },
        { from: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [total, logs] = await Promise.all([
      prisma.emailLog.count({ where }),
      prisma.emailLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          from: true,
          to: true,
          subject: true,
          status: true,
          attempts: true,
          emailType: true,
          app: true,
          lang: true,
          hasAttachments: true,
          attachmentsCount: true,
          userId: true,
          errorMessage: true,
          deliveredAt: true,
          createdAt: true,
        },
      }),
    ]);

    return res.status(200).json({ total, page, limit, logs });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
