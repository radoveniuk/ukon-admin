import React, { useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import countries from 'data/countries.json';
import get from 'lodash.get';
import set from 'lodash.set';

import Layout from 'components/Layout';
import { ListTableCell, ListTableRow } from 'components/ListTable';
import ListTable from 'components/ListTable/ListTable';

import { ORDER_TYPES, OrderType } from 'constants/orders-types';

import textFieldHandler from 'helpers/textFieldHandler';

import prisma from 'lib/prisma';

import { Order } from '.prisma/client';

type EditCell = {
  userId: string;
  cell: string;
  value: any;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const orders = await prisma.order.findMany({
    where: { type: params.name as string },
    include: { user: true },
  });
  return {
    props: { orders },
  };
};

type Props = {
  orders: Order[];
}

const Order = (props: Props) => {
  const router = useRouter();
  const [editingCell, setEditingCell] = useState<null | EditCell>(null);
  const [orders, setOrders] = useState(props.orders);
  const [orderType, setOrderType] = useState<OrderType>(ORDER_TYPES.find((item) => item.name === router.query.name));

  useEffect(() => {
    setOrders(props.orders);
  }, [props.orders]);

  useEffect(() => {
    setOrderType(ORDER_TYPES.find((item) => item.name === router.query.name));
  }, [router.query.name]);


  const saveCell = () => {
    // const userToUpdate = users.find((user) => user.id === editingCell.userId);
    // set(userToUpdate, editingCell.cell, editingCell.value);
    // setUsers((prev) => prev.map((user) => {
    //   if (user.id === userToUpdate.id) {
    //     return userToUpdate;
    //   }
    //   return user;
    // }));
    // fetch('/api/users/update', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(userToUpdate),
    // });
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


  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row);
    }
    return <>{get(row, column.key)}</>;
  };

  return (
    <Layout>
      <Head>
        <title>Úkon Admin | Users</title>
        <meta name="description" content="Úkon Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
          {ORDER_TYPES.map((item) => (
            <Link key={item.name} href={`/orders/${item.name}`}><a className={item.name === router.query.name ? 'active' : ''}>{item.text}</a></Link>
          ))}
        </div>
        <ListTable columns={orderType.cols.map((item) => item.title)}>
          {orders.map((order) => (
            <ListTableRow key={order.id}>
              {orderType.cols.map((col) => (
                <ListTableCell
                  key={col.key}
                  {...(!col.readonly && { onDoubleClick: () => { setEditingCell({ userId: order.id, cell: col.key, value: get(order, col.key) }); } })}
                >
                  {(editingCell?.cell === col.key && editingCell?.userId === order.id) ? renderEditingCell() : renderCell(order, col)}
                </ListTableCell>
              ))}
            </ListTableRow>
          ))}
        </ListTable>
      </main>
    </Layout>
  );
};

export default Order;
