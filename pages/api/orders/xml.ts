import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import get from 'lodash.get';
import set from 'lodash.set';

import { getCreateIndividualXML } from 'helpers/xml';

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
          'Authorization': process.env.NEXT_PUBLIC_SMARTFORM_AUTH,
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

      const formAddress: any = get(order, 'formData.addressSk');
      const { data: { result: { addresses: [parsedAddressRes] } } } = await axios({
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://secure.smartform.cz/smartform-ws/validateAddress/v9',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.NEXT_PUBLIC_SMARTFORM_AUTH,
        },
        data: {
          values: {
            WHOLE_ADDRESS: `${formAddress.street}, ${formAddress.houseRegNumber}/${formAddress.houseNumber}, ${formAddress.city}, ${formAddress.zip}`,
          },
        },
      });
      set(order, 'formData.parsedAddress', parsedAddressRes.values);

      let businessAddressString: any = get(order, 'formData.ourBusinessAddress.value');
      if (get(order, 'formData.businessAddress') !== 'ukon') {
        const formBusinessAddress: any = get(order, 'formData.ownBusinessAddress') ;
        businessAddressString = `${formBusinessAddress.street}, ${formBusinessAddress.houseRegNumber}/${formBusinessAddress.houseNumber}, ${formBusinessAddress.city}, ${formBusinessAddress.zip}`;
      }
      const { data: { result: { addresses: [parsedBusinessAddressRes] } } } = await axios({
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://secure.smartform.cz/smartform-ws/validateAddress/v9',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.NEXT_PUBLIC_SMARTFORM_AUTH,
        },
        data: {
          values: {
            WHOLE_ADDRESS: businessAddressString,
          },
        },
      });

      set(order, 'formData.parsedBusinessAddress', parsedBusinessAddressRes.values);

      const xmlJson = getCreateIndividualXML(order);
      res.send(xmlJson);
      // if (get(order, 'formData.residence.CountryCode') !== 'SK') {
      // } else {
      //   console.log('slovak xml');
      // }
    }
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
}