import React, { useEffect, useState } from 'react';
import { BsTrash, BsUpload } from 'react-icons/bs';
import { FaCheckCircle, FaPen, FaSave, FaTimes, FaTimesCircle } from 'react-icons/fa';
import { VscJson } from 'react-icons/vsc';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Order as OrderType } from '@prisma/client';
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import omit from 'lodash.omit';
import set from 'lodash.set';
import Dialog from 'rc-dialog';
import styled from 'styled-components';

import JsonDialog from 'components/JsonDialog';
import Layout from 'components/Layout';
import ListTable, { ListTableCell, ListTableRow } from 'components/ListTable';
import { Select } from 'components/Select';

//import { ORDER_TYPES, OrderType as OrderTypeEnum, RESULT_DOCS_COLS } from 'constants/orders-types';
import { ORDER_TYPES, OrderType as OrderTypeEnum } from 'constants/orders-types';

import countries from 'data/countries.json';
import STATUSES from 'data/order-statuses.json';

import textFieldHandler from 'helpers/handlers';

import { getAuthProps } from 'lib/authProps';
import prisma from 'lib/prisma';

import { IconButton } from './styles';

type EditCell = {
  orderId: string;
  cell: string;
  value: any;
};

const EditableCellContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  .cell-content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  &:last-child {
    .cell-content {
      display: flex;
      gap: 5px;
    }
  }

  .edit-icon {
    opacity: 1;
    color: #cbd5e1;
    cursor: pointer;
    transition: color 0.2s;
    font-size: 12px;
    flex-shrink: 0;

    &:hover {
      color: #44998a;
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async ({ params, ...ctx }) => {
  const orders = await prisma.order.findMany({
    where: { type: params.name as string },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      createdAt: false,
      updatedAt: false,
      user: true,
      type: true,
      date: true,
      formData: true,
      payed: true,
      status: true,
      number: true,
      paymentId: true,
      resultDocs: true,
      id: true,
    },
  });
  return {
    ...getAuthProps(ctx),
    props: { orders: orders },
  };
};

type Props = {
  orders: OrderType[];
};

const Order = (props: Props) => {
  const router = useRouter();
  const [editingCell, setEditingCell] = useState<null | EditCell>(null);
  const [orders, setOrders] = useState(props.orders);
  const [orderType, setOrderType] = useState<OrderTypeEnum>(ORDER_TYPES.find((item) => item.name === router.query.name));

  useEffect(() => {
    setOrders(props.orders);
  }, [props.orders]);

  useEffect(() => {
    setOrderType(ORDER_TYPES.find((item) => item.name === router.query.name));
  }, [router.query.name]);

  const updateOrder = (orderToUpdate) => {
    setOrders((prev) => prev.map((item) => (item.id === orderToUpdate.id ? orderToUpdate : item)));
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

  const cancelEdit = () => setEditingCell(null);

  const renderEditingCell = () => {
    if (editingCell.cell === 'status') {
      return (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', width: '100%' }}>
          <Select
            defaultOpen={true}
            options={STATUSES.map((status) => ({
              value: status.id,
              text: status.title,
              color: status.color,
            }))}
            onChange={({ value }) => {
              setEditingCell((prev) => ({ ...prev, value }));
            }}
            value={editingCell.value}
          />
          <IconButton $variant="save" onClick={saveCell} title="Uložiť">
            <FaSave />
          </IconButton>
          <IconButton $variant="cancel" onClick={cancelEdit} title="Zrušiť">
            <FaTimes />
          </IconButton>
        </div>
      );
    }

    if (editingCell.cell === 'payed') {
      return (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', width: '100%' }}>
          <Select
            defaultOpen={true}
            options={[
              { value: 'true', text: 'true' },
              { value: 'false', text: 'false' },
            ]}
            onChange={({ value }) => {
              setEditingCell((prev) => ({ ...prev, value: value === 'true' }));
            }}
            value={editingCell.value}
          />
          <IconButton $variant="save" onClick={saveCell} title="Uložiť">
            <FaSave />
          </IconButton>
          <IconButton $variant="cancel" onClick={cancelEdit} title="Zrušiť">
            <FaTimes />
          </IconButton>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', width: '100%' }}>
        <input
          autoFocus
          style={{
            flex: 1,
            minWidth: 0,
            padding: '4px 6px',
            borderRadius: '4px',
            border: '1px solid #44998a',
            outline: 'none',
            fontSize: '12px',
          }}
          value={editingCell.value}
          onChange={textFieldHandler((v) => void setEditingCell((prev) => ({ ...prev, value: v })))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveCell();
            if (e.key === 'Escape') cancelEdit();
          }}
        />
        <IconButton $variant="save" onClick={saveCell} title="Uložiť">
          <FaSave />
        </IconButton>
        <IconButton $variant="cancel" onClick={cancelEdit} title="Zrušiť">
          <FaTimes />
        </IconButton>
      </div>
    );
  };

  const renderCell = (row, column) => {
    let cellContent;

    if (column.render) {
      try {
        cellContent = column.render(row, updateOrder);
      } catch (error) {
        console.log(row, column, error);
        cellContent = 'Error data';
      }
    } else {
      const rawValue = get(row, column.key);

      if (rawValue === true || rawValue === 'true') {
        cellContent = (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <FaCheckCircle color="#10b981" size={18} title="Áno (True)" />
          </div>
        );
      } else if (rawValue === false || rawValue === 'false') {
        cellContent = (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <FaTimesCircle color="#ef4444" size={18} title="Nie (False)" />
          </div>
        );
      } else {
        cellContent = <>{rawValue}</>;
      }
    }

    if (!column.readonly) {
      return (
        <EditableCellContainer>
          <div className="cell-content">{cellContent}</div>
          <FaPen
            className="edit-icon"
            onClick={() => setEditingCell({ orderId: row.id, cell: column.key, value: get(row, column.key) })}
            title="Upraviť"
          />
        </EditableCellContainer>
      );
    }

    return cellContent;
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

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  //const allCols = [...orderType.cols, ...RESULT_DOCS_COLS];
  const allCols = [...orderType.cols];

  return (
    <Layout>
      <Head>
        <title>Úkon Admin | Orders</title>
        <meta name="description" content="Úkon Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className="order-tabs-nav">
          {ORDER_TYPES.map((item) => (
            <Link key={item.name} href={`/orders/${item.name}`}>
              <a className={item.name === router.query.name ? 'active' : ''}>{item.text}</a>
            </Link>
          ))}
        </div>
        <ListTable columns={['Akcie', ...allCols.map((item) => item.title)]}>
          {orders.map((order) => (
            <ListTableRow key={order.id}>
              <ListTableCell style={{ display: 'flex', gap: 5, alignItems: 'center', flexDirection: 'row' }}>
                <button onClick={() => setDeleteDialogData(order)}>
                  <BsTrash />
                </button>
                <button
                  onClick={() => {
                    const modifiedOrder = cloneDeep(order);
                    function replaceCountry(obj: any) {
                      for (const key in obj) {
                        if (obj.hasOwnProperty(key)) {
                          if (typeof obj[key] === 'object') {
                            replaceCountry(obj[key]);
                          } else if (key === 'country') {
                            const countryValue = countries.find((item) => item.CountryCode === obj[key]);
                            obj[key] = countryValue?.Value || obj[key];
                          } else if (key === 'representantCountryCode') {
                            const countryValue = countries.find((item) => item.CountryCode === obj[key]);
                            obj.representantCountry = countryValue?.Value || obj[key];
                          }
                        }
                      }
                    }
                    replaceCountry(modifiedOrder);
                    const formData = modifiedOrder.formData as any;
                    setJsonDialogData(modifiedOrder);
                    if (modifiedOrder.type === 'create-individual' && !formData.parsedName) {
                      fetch(`/api/parse-name?name=${formData.fullname}`)
                        .then((res) => res.json())
                        .then((res) => {
                          setJsonDialogData({
                            ...modifiedOrder,
                            formData: {
                              ...formData,
                              parsedName: res,
                            },
                          });
                        });
                    }
                    if (modifiedOrder.type === 'update-individual' && formData.activities?.length) {
                      const activitiesStopped = formData.activities
                        .filter((item) => item._?.status === 'stopped')
                        .map((item) => ({ description: item.description, ...item._ }));
                      const activitiesClosed = formData.activities
                        .filter((item) => item._?.status === 'closed')
                        .map((item) => ({ description: item.description, ...item._ }));
                      const dataChanges = ['fullname', 'companyName', 'addressResidence', 'businessAddress', 'activities'].filter(
                        (item) => Object.keys(formData).includes(item)
                      );
                      setJsonDialogData({
                        ...modifiedOrder,
                        dataChanges,
                        formData: {
                          ...formData,
                          activitiesStopped,
                          activitiesClosed,
                        },
                      });
                    }
                  }}
                >
                  <VscJson />
                </button>
              </ListTableCell>
              {allCols.map((col) => (
                <ListTableCell
                  key={col.key}
                  {...(!col.readonly && {
                    onDoubleClick: () => {
                      setEditingCell({ orderId: order.id, cell: col.key, value: get(order, col.key) });
                    },
                  })}
                >
                  <div style={{ width: '100%', minWidth: 0 }}>
                    {editingCell?.cell === col.key && editingCell?.orderId === order.id
                      ? renderEditingCell()
                      : renderCell(order, col)
                    }
                  </div>
                </ListTableCell>
              ))}
            </ListTableRow>
          ))}
        </ListTable>
        {!!jsonDialogData && <JsonDialog json={jsonDialogData} visible onClose={() => setJsonDialogData(null)} />}
        {!!deleteDialogData && (
          <Dialog visible onClose={() => setDeleteDialogData(null)}>
            Zadajte heslo aby vymazať objednávku č.: {deleteDialogData.number}
            <input type="text" value={inputValue} onChange={handleInputChange} />
            {inputValue === '2024' && !!deleteDialogData && (
              <div style={{ display: 'flex', gap: 20, justifyContent: 'center', padding: 20 }}>
                <button className="error" onClick={deleteOrder}>
                  Vymazať
                </button>
                <button onClick={() => setDeleteDialogData(null)}>Zrušiť</button>
              </div>
            )}
          </Dialog>
        )}
      </main>
    </Layout>
  );
};

export default Order;
export { ListTable, ListTableCell, ListTableRow };