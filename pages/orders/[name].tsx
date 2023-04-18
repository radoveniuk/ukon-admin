import React, { useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import get from 'lodash.get';
import omit from 'lodash.omit';
import set from 'lodash.set';

import Layout from 'components/Layout';
import { ListTableCell, ListTableRow } from 'components/ListTable';
import ListTable from 'components/ListTable/ListTable';
import { Select } from 'components/Select';

import { ORDER_TYPES, OrderType } from 'constants/orders-types';

import STATUSES from 'data/statuses.json';

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
    const orderToUpdate = orders.find((item) => item.id === editingCell.userId);
    set(orderToUpdate, editingCell.cell, editingCell.value);
    setOrders((prev) => prev.map((item) => {
      if (item.id === orderToUpdate.id) {
        return orderToUpdate;
      }
      return item;
    }));
    fetch('/api/orders/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(omit(orderToUpdate, 'user')),
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
              setEditingCell((prev) => ({
                ...prev,
                value,
              }));
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
