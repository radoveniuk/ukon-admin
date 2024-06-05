import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
// import { User } from '@prisma/client';
import get from 'lodash.get';
import set from 'lodash.set';

import countries from 'data/countries.json';

import { getAuthProps } from 'lib/authProps';

import Layout from '../components/Layout';
import { ListTableCell, ListTableRow } from '../components/ListTable';
import ListTable from '../components/ListTable/ListTable';
import textFieldHandler from '../helpers/textFieldHandler';
import prisma from '../lib/prisma';

const COLS: {
  key: string,
  title: string,
}[] = [
  {
    key: 'fullname',
    title: 'Celé meno',
  },
  {
    key: 'email',
    title: 'Email',
  },
  {
    key: 'pass',
    title: 'Heslo',
  },
  {
    key: 'phone',
    title: 'Telefón',
  },
  {
    key: 'businessName',
    title: 'Obchodné meno',
  },
  {
    key: 'ico',
    title: 'IČO',
  },
  {
    key: 'taxId',
    title: 'DIČ',
  },
  {
    key: 'country',
    title: 'Štát',
  },
  {
    key: 'address.street',
    title: 'Ulica',
  },
  {
    key: 'address.houseRegNumber',
    title: 'Sup. číslo',
  },
  {
    key: 'address.houseNumber',
    title: 'Orient. číslo',
  },
  {
    key: 'address.city',
    title: 'Obec',
  },
  {
    key: 'address.zip',
    title: 'PSČ',
  },
  {
    key: 'mailName',
    title: 'Adresát',
  },
  {
    key: 'mailAddress',
    title: 'Korešpondenčná adresa',
  },
];

type EditCell = {
  userId: string;
  cell: string;
  value: any;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const users = await prisma.user.findMany();
  return {
    ...getAuthProps(ctx),
    props: { users },
  };
};
// TODO fix!!!
type Props = {
  users: any[]
}

const Users = (props: Props) => {
  const [editingCell, setEditingCell] = useState<null | EditCell>(null);
  const [users, setUsers] = useState(props.users);

  const saveCell = () => {
    const userToUpdate = users.find((user) => user.id === editingCell.userId);
    set(userToUpdate, editingCell.cell, editingCell.value);
    setUsers((prev) => prev.map((user) => {
      if (user.id === userToUpdate.id) {
        return userToUpdate;
      }
      return user;
    }));
    fetch('/api/users/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userToUpdate),
    });
    setEditingCell(null);
  };

  const renderEditingCell = () => {
    if (editingCell.cell === 'country') {
      return (
        <div style={{ display: 'flex' }}>
          <select
            autoFocus
            value={editingCell.value?.en}
            onChange={(e) => {
              const value = countries.find((country) => country.en === e.target.value);
              setEditingCell((prev) => ({ ...prev, value }));
            }}
            style={{ minWidth: 200 }}
          >
            <option value={null}></option>
            {countries.map((country) => (
              <option value={country.en} key={country.en}>{country.en}</option>
            ))}
          </select>
          <button onClick={saveCell}><FaSave /></button>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex' }}>
        <input autoFocus style={{ minWidth: 200 }} value={editingCell.value} onChange={textFieldHandler((v) => void setEditingCell((prev) => ({ ...prev, value: v })))} />
        <button onClick={saveCell}><FaSave /></button>
      </div>
    );
  };

  return (
    <Layout>
      <Head>
        <title>Úkon Admin | Users</title>
        <meta name="description" content="Úkon Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ListTable columns={COLS.map((item) => item.title)}>
          {users.map((user) => (
            <ListTableRow key={user.id}>
              {COLS.map((col) => (
                <ListTableCell
                  key={col.key}
                  onDoubleClick={() => { setEditingCell({ userId: user.id, cell: col.key, value: get(user, col.key) }); }}
                >
                  {(editingCell?.cell === col.key && editingCell?.userId === user.id) ? renderEditingCell() : (
                    <>{get(user, col.key !== 'country' ? col.key : 'country.en')}</>
                  )}
                </ListTableCell>
              ))}
            </ListTableRow>
          ))}
        </ListTable>
      </main>
    </Layout>
  );
};

export default Users;
