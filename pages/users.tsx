import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import get from 'lodash.get';
import set from 'lodash.set';

import countries from 'data/countries.json';

import Layout from '../components/Layout';
import { ListTableCell, ListTableRow } from '../components/ListTable';
import ListTable from '../components/ListTable/ListTable';
import textFieldHandler from '../helpers/textFieldHandler';
import prisma from '../lib/prisma';

import { User } from '.prisma/client';

const COLS: {
  key: string,
  title: string,
}[] = [
  {
    key: 'fullname',
    title: 'Fullname',
  },
  {
    key: 'email',
    title: 'Email',
  },
  {
    key: 'pass',
    title: 'Password',
  },
  {
    key: 'phone',
    title: 'Phone',
  },
  {
    key: 'businessName',
    title: 'Business name',
  },
  {
    key: 'ico',
    title: 'ICO',
  },
  {
    key: 'taxId',
    title: 'Tax ID',
  },
  {
    key: 'country',
    title: 'Country',
  },
  {
    key: 'address.street',
    title: 'Street',
  },
  {
    key: 'address.houseRegNumber',
    title: 'Reg. house number',
  },
  {
    key: 'address.houseNumber',
    title: 'House number',
  },
  {
    key: 'address.city',
    title: 'City',
  },
  {
    key: 'address.zip',
    title: 'Zip',
  },
  {
    key: 'mailName',
    title: 'Name for mails',
  },
  {
    key: 'mailAddress',
    title: 'Address for mails',
  },
];

type EditCell = {
  userId: string;
  cell: string;
  value: any;
};

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
