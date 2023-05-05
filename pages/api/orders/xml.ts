import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import get from 'lodash.get';
import set from 'lodash.set';

import { getCreateIndividualForeignerXML } from 'helpers/xml';

import prisma from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query as { id: string };
  try {
    const findOrderRes = await prisma.order.findUnique({
      where: { id },
      include: { user: true },
    });
    const order = { ...findOrderRes };

    if (order.type === 'create-individual') {
      const { data: { outputFields: nameParseRes } } = await axios({
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://secure.smartform.cz/smartform-ws/validatePerson/v2',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic bmxBekY3Um56aDprT0h0NFU5Tw==',
        },
        data: {
          inputFields: [{
            fieldType: 'FULLNAME',
            value: get(order, 'formData.fullname'),
          }],
          requestedFields: [
            { fieldType: 'FIRSTNAME' },
            { fieldType: 'LASTNAME' },
            { fieldType: 'TITLE_BEFORE' },
            { fieldType: 'TITLE_AFTER' },
            { fieldType: 'FULLNAME' },
          ],
        },
      });
      set(order, 'formData.parsedName', {
        name: nameParseRes.find((item) => item.fieldType === 'FIRSTNAME')?.value,
        surname: nameParseRes.find((item) => item.fieldType === 'LASTNAME')?.value,
        prefix: nameParseRes.find((item) => item.fieldType === 'TITLE_BEFORE')?.value,
        postfix: nameParseRes.find((item) => item.fieldType === 'TITLE_AFTER')?.value,
      });

      if (get(order, 'formData.residence.CountryCode') !== 'SK') {
        const xmlJson = getCreateIndividualForeignerXML(order);
        res.send(xmlJson);
      } else {
        console.log('slovak xml');
      }
    }
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
}