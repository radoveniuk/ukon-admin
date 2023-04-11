import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import get from 'lodash.get';

import Layout from '../components/Layout';
import { ListTableCell, ListTableRow } from '../components/ListTable';
import ListTable from '../components/ListTable/ListTable';
import prisma from '../lib/prisma';

import { User } from '.prisma/client';

const COLS: {
  key: string,
  title: string,
}[] = [
  {
    key: 'fullname',
    title: 'Имя',
  },
  {
    key: 'email',
    title: 'Email',
  },
  {
    key: 'pass',
    title: 'Пароль',
  },
  {
    key: 'phone',
    title: 'Phone',
  },
  {
    key: 'businessName',
    title: 'Название предприятия',
  },
  {
    key: 'ico',
    title: 'ID предприятия',
  },
  {
    key: 'taxId',
    title: 'Налоговый номер',
  },
  {
    key: 'country.ru',
    title: 'Страна',
  },
  {
    key: 'address.street',
    title: 'Улица',
  },
  {
    key: 'address.houseRegNumber',
    title: 'Рег. номер дома',
  },
  {
    key: 'address.houseNumber',
    title: 'Номер дома',
  },
  {
    key: 'address.city',
    title: 'Населенный пункт',
  },
  {
    key: 'address.zip',
    title: 'Индекс',
  },
  {
    key: 'mailName',
    title: 'Имя для отправки',
  },
  {
    key: 'mailAddress',
    title: 'Адрес для отправки',
  },
];

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await prisma.user.findMany();
  return {
    props: { users },
  };
};

type Props = {
  users: User[]
}

const Users = (props: Props) => {
  return (
    <Layout>
      <Head>
        <title>Úkon Admin | Users</title>
        <meta name="description" content="Úkon Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ListTable columns={COLS.map((item) => item.title)}>
          {props.users.map((user) => (
            <ListTableRow key={user.id}>
              {COLS.map((col) => (
                <ListTableCell key={col.key}>{get(user, col.key)}</ListTableCell>
              ))}
            </ListTableRow>
          ))}
        </ListTable>
      </main>
    </Layout>
  );
};

export default Users;
