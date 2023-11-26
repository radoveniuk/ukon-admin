import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { name } = req.query;
  try {
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
          value: name,
        }],
        requestedFields: [
          { fieldType: 'FIRSTNAME' },
          { fieldType: 'LASTNAME' },
          { fieldType: 'TITLE_BEFORE' },
          { fieldType: 'TITLE_AFTER' },
        ],
      },
    });
    res.status(200).json({
      name: nameParseRes.find((item) => item.fieldType === 'FIRSTNAME')?.value,
      surname: nameParseRes.find((item) => item.fieldType === 'LASTNAME')?.value,
      prefix: nameParseRes.find((item) => item.fieldType === 'TITLE_BEFORE')?.value,
      postfix: nameParseRes.find((item) => item.fieldType === 'TITLE_AFTER')?.value,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({ error });
  }
}