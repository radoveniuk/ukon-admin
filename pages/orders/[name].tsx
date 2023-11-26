import React, { useEffect, useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import { FaSave } from 'react-icons/fa';
import { VscJson } from 'react-icons/vsc';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Order } from '@prisma/client';
import get from 'lodash.get';
import omit from 'lodash.omit';
import set from 'lodash.set';
import Dialog from 'rc-dialog';

import JsonDialog from 'components/JsonDialog';
import Layout from 'components/Layout';
import ListTable, { ListTableCell, ListTableRow } from 'components/ListTable';
import { Select } from 'components/Select';

import { ORDER_TYPES, OrderType } from 'constants/orders-types';

import STATUSES from 'data/order-statuses.json';

import textFieldHandler from 'helpers/textFieldHandler';

import { getAuthProps } from 'lib/authProps';
import prisma from 'lib/prisma';

type EditCell = {
  orderId: string;
  cell: string;
  value: any;
};

export const getServerSideProps: GetServerSideProps = async ({ params, ...ctx }) => {
  const orders = await prisma.order.findMany({
    where: { type: params.name as string },
    include: { user: true },
  });
  return {
    ...getAuthProps(ctx),
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

  const updateOrder = (orderToUpdate) => {
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
  };

  const saveCell = () => {
    const orderToUpdate = orders.find((item) => item.id === editingCell.orderId);
    set(orderToUpdate, editingCell.cell, editingCell.value);
    updateOrder(orderToUpdate);
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
    if (editingCell.cell === 'payed') {
      return (
        <div style={{ display: 'flex' }}>
          <Select
            options={[
              {
                value: 'true',
                text: 'true',
              },
              {
                value: 'false',
                text: 'false',
              },
            ]}
            onChange={({ value }) => {
              setEditingCell((prev) => ({
                ...prev,
                value: value === 'true',
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
      try {
        return column.render(row, updateOrder);
      } catch (error) {
        console.log(row, column, error);

        return 'Error data';
      }
    }
    return <>{get(row, column.key)}</>;
  };

  const [jsonDialogData, setJsonDialogData] = useState<any>(null);
  const [deleteDialogData, setDeleteDialogData] = useState<any>(null);

  const deleteOrder = () => {
    setOrders((prev) => prev.filter((item) => item.id !== deleteDialogData.id));
    fetch('/api/orders/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: deleteDialogData.id }),
    });
    setDeleteDialogData(null);
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
        <ListTable columns={['Actions', ...orderType.cols.map((item) => item.title)]}>
          {orders.map((order) => (
            <ListTableRow key={order.id}>
              <ListTableCell style={{ display: 'flex', gap: 20, flexDirection: 'row' }}>
                <button onClick={() => setDeleteDialogData(order)}><BsTrash />Delete</button>
                <button
                  onClick={() => {
                    const formData = order.formData as any;
                    setJsonDialogData(order);
                    if (order.type === 'create-individual') {
                      fetch(`/api/parse-name?name=${formData.fullname}`).then(res=>res.json()).then((res) => {
                        setJsonDialogData({
                          ...order,
                          formData: {
                            ...formData,
                            parsedName: res,
                          },
                        });

                      });
                    }
                  }}
                >
                  <VscJson />JSON
                </button>
              </ListTableCell>
              {orderType.cols.map((col) => (
                <ListTableCell
                  key={col.key}
                  {...(!col.readonly && { onDoubleClick: () => { setEditingCell({ orderId: order.id, cell: col.key, value: get(order, col.key) }); } })}
                >
                  {(editingCell?.cell === col.key && editingCell?.orderId === order.id) ? renderEditingCell() : renderCell(order, col)}
                </ListTableCell>
              ))}
            </ListTableRow>
          ))}
        </ListTable>
        {!!jsonDialogData && (
          <JsonDialog
            json={jsonDialogData}
            visible
            onClose={() => setJsonDialogData(null)}
          />
        )}
        {!!deleteDialogData && (
          <Dialog
            visible
            onClose={() => setDeleteDialogData(null)}
          >
            You are about to delete order {deleteDialogData.number}
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', padding: 20 }}>
              <button className="error" onClick={deleteOrder}>Delete</button>
              <button>Cancel</button>
            </div>
          </Dialog>
        )}
      </main>
    </Layout>
  );
};

export default Order;
