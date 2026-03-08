import React, { useEffect, useState } from 'react';
import { BsTrash, BsUpload } from 'react-icons/bs';
import { FaCheckCircle, FaInfo,FaPen, FaSave, FaSpinner, FaTimes, FaTimesCircle } from 'react-icons/fa';
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
import styled, { keyframes } from 'styled-components';

import IconButton from 'components/IconButton';
import JsonDialog from 'components/JsonDialog';
import Layout from 'components/Layout';
import ListTable, { ListTableCell, ListTableRow } from 'components/ListTable';
import { Select } from 'components/Select';

import { ORDER_TYPES, OrderType as OrderTypeEnum } from 'constants/orders-types';

import countries from 'data/countries.json';
import STATUSES from 'data/order-statuses.json';

import textFieldHandler from 'helpers/handlers';

import { getAuthProps } from 'lib/authProps';
import prisma from 'lib/prisma';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerIcon = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;

const BigSpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: #44998a;
  gap: 16px;
  font-size: 18px;
  font-weight: 500;
`;

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

// 1. Словник
const orderTypesTranslations: Record<string, string> = {
  'create-individual': 'Založenie živnosti',
  'update-individual': 'Zmena v živnosti',
  'general-order': 'Všeobecná objednávka',
  'create-company': 'Založenie s.r.o.',
  'update-company': 'Zmena v s.r.o.',
  'create-individual-refugee': 'Založenie živnosti (dočasné útočisko)',
  // Додати ще
};

// 2. Фомування адреси
const getPermanentResidence = (formData: any) => {
  if (!formData) return null;
  const address = [formData.address?.description, formData.residence?.Value]
    .filter(Boolean)
    .join(', ');

  return address || null;
};

// 3. Miesto podnikania
const getBusinessAddress = (formData: any) => {
  if (!formData) return null;
  const type = formData.businessAddress;
  if (type === 'ukon') {
    return 'Hornočermánska 1556/76, 94901 Nitra';
  }
  if (type === 'permit') {
    return formData.address ? [[formData.address.street, [formData.address.houseRegNumber, formData.address.houseNumber].filter(Boolean).join('/')].filter(Boolean).join(' '), [formData.address.zip, formData.address.city].filter(Boolean).join(' '), formData.country?.Value || formData.residence?.Value].filter(Boolean).join(', ') : null;
  }
  if (type === 'own') {
    return formData.ownBusinessAddress ? [[formData.ownBusinessAddress.street, [formData.ownBusinessAddress.houseRegNumber, formData.ownBusinessAddress.houseNumber].filter(Boolean).join('/')].filter(Boolean).join(' '), [formData.ownBusinessAddress.zip, formData.ownBusinessAddress.city].filter(Boolean).join(' '), + ', Slovenská republika'].filter(Boolean).join(', ') : null;
  }
  return type;
};

// 4. Набори полів
const getModalFields = (data: any) => {
  if (!data) return [];

  // Загальні поля
  const commonFields = [
    { label: 'Objednávka', value: orderTypesTranslations[data.type] || data.type },
    { label: 'Číslo', value: data.number },
    { label: 'Dátum', value: data.date },
    { label: 'Objednávateľ', value: data.user?.fullname },
    { label: 'E-mail', value: data.user?.email, isEmail: true },
    { label: 'Tel. č.', value: data.user?.phone },
  ];
  let specificFields: any[] = [];

  switch (data.type) {
  // --- Реєстрація ФОП ---
  case 'create-individual':
    specificFields = [
      { label: 'Meno Priezvisko', value: [data.formData?.parsedName?.prefix, data.formData?.parsedName?.name, data.formData?.parsedName?.surname, data.formData?.parsedName?.postfix].filter(Boolean).join(' ') },
      { label: 'Štátna príslušnosť', value: data.formData?.citizenship?.Value },
      { label: 'Miesto podnikania', value: getBusinessAddress(data.formData) + ' (' + data.formData?.businessAddress + ')' },
      { label: 'Trvalý pobyt', value: data.formData?.address ? [[data.formData.address.street, [data.formData.address.houseRegNumber, data.formData.address.houseNumber].filter(Boolean).join('/')].filter(Boolean).join(' '), [data.formData.address.zip, data.formData.address.city].filter(Boolean).join(' '), data.formData.country?.Value || data.formData.residence?.Value].filter(Boolean).join(', ') : null },
      { label: 'Pobyt na úzmení SR', value: data.formData?.addressSk ? [[data.formData.addressSk.street, [data.formData.addressSk.houseRegNumber, data.formData.addressSk.houseNumber].filter(Boolean).join('/')].filter(Boolean).join(' '), [data.formData.addressSk.zip, data.formData.addressSk.city].filter(Boolean).join(' ')].filter(Boolean).join(', ') : null },
      { label: 'Dátum narodenia', value: data.formData?.birthdate },
      { label: 'Rodné číslo', value: data.formData?.physicalNumber },
      { label: 'Obchodné meno', value: data.formData?.companyNameAll },
      { label: 'Číslo dokladu', value: data.formData?.docNumber },
      { label: 'Poistenie', value: data.formData?.insurance?.Value },
      { label: 'IČO', value: data.formData?.companyNumber },
      {
        label: 'Predmety podnikania',
        value: (() => {
          const activities = [
            data.formData?.mainActivity?.Value,
            ...(data.formData?.otherActivities?.map((item: any) => item.Value) || []),
          ].filter(Boolean);
          return activities.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {activities.map((act, index) => (
                <span key={index}>
                  {index === 0 ? <>{act} (Hlavný)</> : act}
                </span>
              ))}
            </div>
          ) : null;
        })(),
      },
      { label: 'Poznámka', value: data.formData?.comment },
      // Додати ще
    ];
    break;

  // --- Зміни у ФОП ---
  case 'update-individual':
    specificFields = [
      {
        label: 'Rozsah zmien',
        value: (() => {
          const d = data.formData;
          if (!d) return null;
          const changes: string[] = [];
          // 1. Закрытие
          if (d.liquidateFrom) {
            changes.push('Zrušenie živnosti');
          }
          // 2. Приостановка
          if (d.stopFrom || d.stopTo) {
            changes.push('Pozastavenie živnosti');
          }
          // 3. Возобновление
          if (d.openFrom && d.prev?.activities?.suspended_from) {
            changes.push('Obnovenie živnosti');
          }
          // 4. Приостановка КВЭДов (проверяем, есть ли массив/объект и не пустой ли он)
          if (d.activitiesStopped?.length > 0 || d.activitiesStopped?.description) {
            changes.push('Pozastavenie predmetov podnikania');
          }
          // 5. Удаление КВЭДов
          if (d.activitiesClosed?.length > 0 || d.activitiesClosed?.description) {
            changes.push('Vymazanie predmetov podnikania');
          }
          // 6. Возобновление КВЭДов
          if (d.activitiesReopen?.length > 0 || d.activitiesReopen?.description) {
            changes.push('Obnovenie predmetov podnikania');
          }
          // 7. Добавление КВЭДов
          if (d.newActivities?.length > 0 || d.newActivities?.Value) {
            changes.push('Pridanie predmetov podnikania');
          }
          // 8. Изменение данных ИП
          if (
            d.fullname ||
            d.companyName ||
            d.addressResidence?.country ||
            d.permitBusinessAddress?.description ||
            d.ownBusinessAddress?.description ||
            d.businessAddress === 'ukon' ||
            d.addressResidence?.street ||
            d.addressResidence?.houseNumber
          ) {
            changes.push('Zmena údajov podnikateľa');
          }
          return changes.length > 0 ? changes.join(', ') : null;
        })(),
      },
      { label: 'Obchodné meno', value: data.formData?.prev.companyName },
      { label: 'IČO', value: data.formData?.prev.cin },
      { label: 'Miesto podnikania', value: [ data.formData?.prev?.businessAddress, data.formData?.businessAddress ? `(${data.formData.businessAddress})` : null ].filter(Boolean).join(' ') || null },
      { label: 'Okresný úrad', value: data.formData?.prev.register },
      { label: 'Trvalý pobyt', value: [ data.formData?.prev?.address, data.formData?.residence?.Value || data.formData?.addressResidence?.country ].filter(Boolean).join(', ') || null },
      { label: 'Pobyt na úzmení SR', value: data.formData?.addressSk ? [[data.formData.addressSk.street, [data.formData.addressSk.houseRegNumber, data.formData.addressSk.houseNumber].filter(Boolean).join('/')].filter(Boolean).join(' '), [data.formData.addressSk.zip, data.formData.addressSk.city].filter(Boolean).join(' ')].filter(Boolean).join(', ') : null },
      { label: 'Dátum narodenia', value: data.formData?.birthdate },
      { label: 'Rodné číslo', value: data.formData?.physicalNumber },
      { label: 'Číslo dokladu', value: data.formData?.docNumber },
      { label: 'Poistenie', value: data.formData?.insurance?.Value },
      { label: 'Poznámka', value: data.formData?.comment },
      // Додати ще
    ];
    break;

  // --- Загальне замовлення ---
  case 'general-order':
    specificFields = [
      { label: 'Meno klienta', value: data.formData?.fullname },
      { label: 'Adresa', value: data.formData?.address + ', ' + data.formData?.residence.Value },
      { label: 'Email', value: data.formData?.email },
      { label: 'Tel. číslo', value: data.formData?.phone },
      { label: 'Služba', value: data.formData?.services },
      { label: 'Cena', value: data.formData?.totalPrice + ' €' },
      { label: 'Poznámka', value: data.formData?.comment },
      // Додати ще
    ];
    break;

  default:
    break;
  }
  return [...commonFields, ...specificFields];
};

const Order = (props: Props) => {
  const router = useRouter();
  const [editingCell, setEditingCell] = useState<null | EditCell>(null);
  const [orders, setOrders] = useState(props.orders);
  const [orderType, setOrderType] = useState<OrderTypeEnum>(ORDER_TYPES.find((item) => item.name === router.query.name));

  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsFetchingOrders(true);
    const handleComplete = () => setIsFetchingOrders(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  useEffect(() => {
    setOrders(props.orders);
  }, [props.orders]);

  useEffect(() => {
    setOrderType(ORDER_TYPES.find((item) => item.name === router.query.name));
  }, [router.query.name]);

  const updateOrder = async (orderToUpdate) => {
    setIsActionLoading(true);
    try {
      await fetch('/api/orders/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(omit(orderToUpdate, 'user')),
      });
      setOrders((prev) => prev.map((item) => (item.id === orderToUpdate.id ? orderToUpdate : item)));
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const saveCell = async () => {
    const orderToUpdate = orders.find((item) => item.id === editingCell.orderId);
    const updatedOrder = cloneDeep(orderToUpdate);
    set(updatedOrder, editingCell.cell, editingCell.value);

    await updateOrder(updatedOrder);
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
          <IconButton $variant="save" onClick={saveCell} title="Uložiť" disabled={isActionLoading}>
            {isActionLoading ? <SpinnerIcon /> : <FaSave />}
          </IconButton>
          <IconButton $variant="cancel" onClick={cancelEdit} title="Zrušiť" disabled={isActionLoading}>
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
          <IconButton $variant="save" onClick={saveCell} title="Uložiť" disabled={isActionLoading}>
            {isActionLoading ? <SpinnerIcon /> : <FaSave />}
          </IconButton>
          <IconButton $variant="cancel" onClick={cancelEdit} title="Zrušiť" disabled={isActionLoading}>
            <FaTimes />
          </IconButton>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', width: '100%' }}>
        <input
          autoFocus
          disabled={isActionLoading}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '4px 6px',
            borderRadius: '4px',
            border: '1px solid #44998a',
            outline: 'none',
            fontSize: '12px',
            opacity: isActionLoading ? 0.5 : 1,
          }}
          value={editingCell.value}
          onChange={textFieldHandler((v) => void setEditingCell((prev) => ({ ...prev, value: v })))}
          onKeyDown={(e) => {
            if (isActionLoading) return;
            if (e.key === 'Enter') saveCell();
            if (e.key === 'Escape') cancelEdit();
          }}
        />
        <IconButton $variant="save" onClick={saveCell} title="Uložiť" disabled={isActionLoading}>
          {isActionLoading ? <SpinnerIcon /> : <FaSave />}
        </IconButton>
        <IconButton $variant="cancel" onClick={cancelEdit} title="Zrušiť" disabled={isActionLoading}>
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
  const [userDialogData, setUserDialogData] = useState<any>(null);

  const deleteOrder = async () => {
    setIsActionLoading(true);
    try {
      await fetch('/api/orders/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deleteDialogData.id }),
      });
      setOrders((prev) => prev.filter((item) => item.id !== deleteDialogData.id));
      setDeleteDialogData(null);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsActionLoading(false);
      setInputValue('');
    }
  };

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const allCols = [...orderType.cols];

  const [favicon, setFavicon] = useState('/faviconOk.ico');
  const [pageTitle, setPageTitle] = useState('Orders | OkiDoki Admin');

  useEffect(() => {
    if (window.location.href.includes('ukon')) {
      setFavicon('/faviconUkon.ico');
      setPageTitle('Orders | Úkon Admin');
    } else {
      setFavicon('/faviconOk.ico');
      setPageTitle('Orders | OkiDoki Admin');
    }
  }, []);

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Úkon Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={favicon} />
      </Head>
      <main>
        <div className="order-tabs-nav">
          {ORDER_TYPES.map((item) => (
            <Link key={item.name} href={`/orders/${item.name}`}>
              <a className={item.name === router.query.name ? 'active' : ''}>{item.text}</a>
            </Link>
          ))}
        </div>

        {isFetchingOrders ? (
          <BigSpinnerContainer>
            <SpinnerIcon size={40} />
            <div>Načítavanie...</div>
          </BigSpinnerContainer>
        ) : (
          <ListTable columns={['Akcie', ...allCols.map((item) => item.title)]}>
            {orders.map((order) => (
              <ListTableRow key={order.id}>
                <ListTableCell style={{ display: 'flex', gap: 5, alignItems: 'center', flexDirection: 'row' }}>
                  <button style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12 }} onClick={() => setDeleteDialogData(order)}>
                    <BsTrash />
                  </button>
                  <button
                    style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12 }}
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
                  <button
                    style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setUserDialogData(order);
                    }}
                    title="Objednávka"
                  >
                    <FaInfo />
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
        )}

        {!!jsonDialogData && <JsonDialog json={jsonDialogData} visible onClose={() => setJsonDialogData(null)} />}

        {!!deleteDialogData && (
          <Dialog visible onClose={() => !isActionLoading && setDeleteDialogData(null)}>
            <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b' }}>
                  Vymazať objednávku
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
                  Zadajte heslo pre vymazanie objednávky č. <strong style={{ color: '#1e293b' }}>{deleteDialogData.number}</strong>. Táto akcia je nenávratná.
                </p>
              </div>

              <input
                type="password"
                placeholder="Zadajte heslo..."
                value={inputValue}
                onChange={handleInputChange}
                disabled={isActionLoading}
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  color: '#1e293b',
                  backgroundColor: '#f8fafb',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  opacity: isActionLoading ? 0.6 : 1,
                }}
              />

              {inputValue === '2024' && !!deleteDialogData && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    disabled={isActionLoading}
                    onClick={() => setDeleteDialogData(null)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: isActionLoading ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      transition: 'background 0.2s',
                      opacity: isActionLoading ? 0.6 : 1,
                    }}
                    onMouseOver={(e) => !isActionLoading && (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                    onMouseOut={(e) => !isActionLoading && (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  >
                    Zrušiť
                  </button>
                  <button
                    onClick={deleteOrder}
                    disabled={isActionLoading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: isActionLoading ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      transition: 'background 0.2s',
                      opacity: isActionLoading ? 0.7 : 1,
                      minWidth: '85px',
                    }}
                    onMouseOver={(e) => !isActionLoading && (e.currentTarget.style.backgroundColor = '#dc2626')}
                    onMouseOut={(e) => !isActionLoading && (e.currentTarget.style.backgroundColor = '#ef4444')}
                  >
                    {isActionLoading ? <SpinnerIcon /> : 'Vymazať'}
                  </button>
                </div>
              )}
            </div>
          </Dialog>
        )}
        {!!userDialogData && (
          <Dialog visible onClose={() => setUserDialogData(null)}>
            <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>
                  Objednávka
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <tbody>
                    {getModalFields(userDialogData).map((field, index, array) => (
                      <tr key={index} style={{ borderBottom: index !== array.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                        <th style={{ padding: '10px 0', color: '#64748b', fontWeight: 500, fontSize: '14px', width: '40%', verticalAlign: 'top' }}>
                          {field.label}
                        </th>
                        <td style={{ padding: '10px 0', color: '#1e293b', fontSize: '14px', fontWeight: 600, wordBreak: 'break-word' }}>
                          {field.value ? (
                            field.isEmail ? (
                              <a href={`mailto:${field.value}`} style={{ color: '#44998a', textDecoration: 'none' }}>
                                {field.value}
                              </a>
                            ) : (
                              field.value
                            )
                          ) : (
                            <span style={{ color: '#94a3b8', fontWeight: 400 }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Dialog>
        )}
      </main>
    </Layout>
  );
};


export default Order;
export { ListTable, ListTableCell, ListTableRow };

