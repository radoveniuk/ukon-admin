import React, { useState } from 'react';
import { BiMailSend } from 'react-icons/bi';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Mail, VirtualAddress } from '@prisma/client';

import { Select } from 'components/Select';

import prisma from 'lib/prisma';

import Layout from '../components/Layout';

export const getServerSideProps: GetServerSideProps = async () => {
  const mailBoxes = await prisma.virtualAddress.findMany({
    include: { user: true },
  });
  const mails = await prisma.mail.findMany({
    include: { virtualAddress: { include: { user: true } } },
  });
  return {
    props: { mailBoxes, mails },
  };
};

type Props = {
  mailBoxes: VirtualAddress[];
  mails: Mail[];
}

const Mails = ({ mailBoxes, mails }: Props) => {
  const [selectedMailBox, setSelectedMailBox] = useState<VirtualAddress | null>(null);
  const [selectedMailBoxMails, setSelectedMailBoxMails] = useState<Mail[]>([]);
  return (
    <Layout>
      <Head>
        <title>Úkon Admin | Mails</title>
        <meta name="description" content="Úkon Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div style={{ display: 'flex', maxWidth: 400, gap: 20 }}>
          <Select
            options={mailBoxes.map((item: any) => ({ value: item.id, text: `${item.user.fullname}` }))}
            onChange={({ value }) => {
              setSelectedMailBox(mailBoxes.find((item) => item.id === value));
              setSelectedMailBoxMails(mails.filter((item) => item.virtualAddressId === value));
            }}
            value={selectedMailBox?.id || ''}
          />
          <button disabled={!selectedMailBox}><BiMailSend size={20} /> New mail</button>
        </div>
      </main>
    </Layout>
  );
};

export default Mails;
