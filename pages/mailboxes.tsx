import React, { useState } from 'react';
import { BiBox } from 'react-icons/bi';
import { FaSave } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
// import { Mail, Order, VirtualAddress } from '@prisma/client';
import get from 'lodash.get';
import set from 'lodash.set';
import Dialog from 'rc-dialog';

import { ListTableCell, ListTableRow } from 'components/ListTable';
import ListTable from 'components/ListTable/ListTable';
import { Select } from 'components/Select';

import STATUSES from 'data/mail-statuses.json';

import { plus } from 'helpers/datetime';
import textFieldHandler from 'helpers/textFieldHandler';

import { getAuthProps } from 'lib/authProps';
import prisma from 'lib/prisma';

import Layout from '../components/Layout';

const COLS = [
  {
    key: 'user.fullname',
    title: 'User name',
    readonly: true,
  },
  {
    key: 'businessName',
    title: 'Business name',
  },
  {
    key: 'businessId',
    title: 'Business ID',
  },
  {
    key: 'address',
    title: 'Address',
  },
  {
    key: 'openDate',
    title: 'Open from',
  },
  {
    key: 'expireDate',
    title: 'Expire',
  },
  {
    key: 'tariff',
    title: 'Tariff',
    render: (row) => <>{row.tariff}€ / year</>,
  },
];


type EditCell = {
  mailId: string;
  cell: string;
  value: any;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const mailboxesData = await prisma.virtualAddress.findMany({
    include: { user: true },
  });
  const orders = await prisma.order.findMany({
    where: { type: 'v-address' },
    include: { user: true },
  });
  return {
    ...getAuthProps(ctx),
    props: { mailboxesData, orders },
  };
};
// todo fix
type Props = {
  mailboxesData: any[];
  orders: any[];
}

const Mails = ({ mailboxesData, orders }: Props) => {
  const [editingCell, setEditingCell] = useState<null | EditCell>(null);
  const [mailboxes, setMailboxes] = useState(mailboxesData);

  const [openCreateMailbox, setOpenCreateMailbox] = useState(false);
  // todo fix
  const [createMailOrder, setCreateMailOrder] = useState<any>(null);

  const createMailbox = () => {
    const formData = createMailOrder.formData as any;
    fetch('/api/mailbox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: createMailOrder.userId,
        tariff: formData.tariff.price.toString(),
        expireDate: plus(formData.orderFromDate, { year: 1 }),
        businessName: `${formData.fullname} - ${formData.businessName}`,
        businessId: formData.businessId,
        period: '1',
        address: formData.address.value,
        orderId: createMailOrder.id,
        openDate: formData.orderFromDate,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setMailboxes((prev) => [res, ...prev]);
      });
  };

  const saveCell = () => {
    const mailToUpdate = mailboxes.find((item) => item.id === editingCell.mailId);
    set(mailToUpdate, editingCell.cell, editingCell.value);
    fetch('/api/mailbox', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [editingCell.cell]: editingCell.value, id: mailToUpdate.id }),
    });
    setEditingCell(null);
  };

  const renderEditingCell = () => {
    if (editingCell.cell === 'status') {
      return (
        <div style={{ display: 'flex' }}>
          <Select
            options={STATUSES.map((status) => ({
              value: status.id,
              text: status.title,
            }))}
            onChange={({ value }) => {
              setEditingCell((prev) => ({ ...prev, value }));
            }}
            value={editingCell.value}
          />
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

  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row);
    }
    return <>{get(row, column.key)}</>;
  };

  return (
    <Layout>
      <Head>
        <title>Úkon Admin | Mailboxes</title>
        <meta name="description" content="Úkon Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
          <button onClick={() => void setOpenCreateMailbox(true)}><BiBox size={20} />New mailbox</button>
        </div>
        {!!mailboxes.length && (
          <ListTable columns={[...COLS.map((item) => item.title)]}>
            {mailboxes.map((item) => (
              <ListTableRow key={item.id}>
                {COLS.map((col) => (
                  <ListTableCell
                    key={col.key}
                    onDoubleClick={() => { !col.readonly && setEditingCell({ mailId: item.id, cell: col.key, value: get(item, col.key) }); }}
                  >
                    {(editingCell?.cell === col.key && editingCell?.mailId === item.id) ? renderEditingCell() : renderCell(item, col)}
                  </ListTableCell>
                ))}
              </ListTableRow>
            ))}
          </ListTable>
        )}
        {openCreateMailbox && (
          <Dialog title="Create new mailbox" onClose={() => {setOpenCreateMailbox(false);}} visible={openCreateMailbox} width={300}>
            <label>
              <span>Order for virtual address</span>
              <Select
                options={orders.map((item: any) => {
                  return {
                    value: item.id,
                    text: `${item.user.fullname} (${item.formData.fullname}, ${item.formData.businessName})`,
                  };
                })}
                onChange={({ value }) => {
                  setCreateMailOrder(orders.find(({ id }) => id === value));
                }}
                value={createMailOrder?.id || null}
              />
            </label>
            <button disabled={!createMailOrder} onClick={createMailbox}>Create</button>
          </Dialog>
        )}
      </main>
    </Layout>
  );
};

export default Mails;
