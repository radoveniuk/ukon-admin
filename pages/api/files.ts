import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import contentDisposition  from 'content-disposition';
import formidable from 'formidable';
import fs from 'fs';
import mime from 'mime-types';

//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const post = () => new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    return form.parse(req, async (_err, _fields, files: any) => {
      const contents = fs.readFileSync(files.file.filepath);
      const contentType = mime.lookup(files.file.originalFilename);
      const filename = `${(new Date()).getTime()}-${files.file.originalFilename}`;

      const options = {
        method: 'PUT',
        url: `https://storage.bunnycdn.com/ukon/bucket/${filename}`,
        headers: {
          'AccessKey': process.env.NEXT_PUBLIC_BUNNY_ACCESS_KEY,
          'content-type': contentType,
        },
        data: contents,
      };

      await axios
        .request(options)
        .then(() => {
          res.status(201).json({ filename });
          resolve(filename);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error });
          reject(error);
        });
    });
  });

  if (req.method === 'POST') {
    return post();
  }
  if (req.method === 'GET') {
    const id = req.query.id as string;

    await axios({
      method: 'GET',
      url: `https://storage.bunnycdn.com/ukon/bucket/${id}`,
      headers: { accept: '*/*', AccessKey: process.env.NEXT_PUBLIC_BUNNY_ACCESS_KEY },
      responseType: 'stream',
    })
      .then((response) => {
        res.setHeader('Content-Type', response.headers['content-type']);
        res.setHeader('content-length', response.headers['content-length']);
        res.setHeader('Content-Disposition', contentDisposition(id as string));
        response.data.pipe(res);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send(error);
      });
  }
}