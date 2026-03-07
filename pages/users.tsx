import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaPen, FaSave, FaTimes, FaTimesCircle } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import get from 'lodash.get';
import set from 'lodash.set';
import styled from 'styled-components';

import countries from 'data/countries.json';

import { getAuthProps } from 'lib/authProps';

import Layout from '../components/Layout';
import { ListTableCell, ListTableRow } from '../components/ListTable';
import ListTable from '../components/ListTable/ListTable';
import textFieldHandler, { checkboxHandler } from '../helpers/handlers';
import prisma from '../lib/prisma';

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

const IconButton = styled.button<{ $variant?: 'save' | 'cancel' | 'action' }>`
  && {
    background-color: transparent;
    border: none;
    padding: 4px;
    margin: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #cbd5e1;
    transition: color 0.2s;
    font-size: 14px;
    flex-shrink: 0;
    border-radius: 0;
    gap: 0;

    &:hover {
      background-color: transparent;
      color: ${(props) => props.$variant === 'cancel' ? '#ef4444' : props.$variant === 'save' ? '#44998a' : '#64748b'};
    }

    &:focus {
      outline: none;
    }
  }
`;

const COLS = [
  { key: 'fullname', title: 'Celé meno' },
  { key: 'email', title: 'Email' },
  { key: 'phone', title: 'Telefón' },
  { key: 'businessName', title: 'Obchodné meno' },
  { key: 'ico', title: 'IČO' },
  { key: 'taxId', title: 'DIČ' },
  { key: 'country', title: 'Štát' },
  { key: 'address.street', title: 'Ulica' },
  { key: 'address.houseRegNumber', title: 'Sup. číslo' },
  { key: 'address.houseNumber', title: 'Orient. číslo' },
  { key: 'address.city', title: 'Obec' },
  { key: 'address.zip', title: 'PSČ' },
  { key: 'mailName', title: 'Adresát' },
  { key: 'mailAddress', title: 'Korešpondenčná adresa' },
  { key: 'isAllowedGeneralOrder', title: 'Povoleny general order' },
  { key: 'pass', title: 'Heslo' },
] as const;

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

type Props = {
  users: any[];
};

const Users = (props: Props) => {
  const [editingCell, setEditingCell] = useState<null | EditCell>(null);
  const [users, setUsers] = useState(props.users);

  const saveChanges = (data = editingCell) => {
    if (!data) return;
    const userToUpdate = users.find((user) => user.id === data.userId);
    set(userToUpdate, data.cell, data.value);

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userToUpdate.id ? { ...user, ...userToUpdate } : user
      )
    );

    fetch('/api/users/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userToUpdate),
    });
  };

  const saveCell = () => {
    saveChanges();
    setEditingCell(null);
  };

  const cancelEdit = () => setEditingCell(null);

  const renderEditingCell = () => {
    if (editingCell?.cell === 'country') {
      return (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', width: '100%' }}>
          <select
            autoFocus
            value={editingCell.value?.en || ''}
            onChange={(e) => {
              const value = countries.find((country) => country.en === e.target.value);
              setEditingCell((prev) => prev ? { ...prev, value } : null);
            }}
            style={{
              flex: 1,
              minWidth: 0,
              padding: '4px 6px',
              borderRadius: '4px',
              border: '1px solid #44998a',
              outline: 'none',
              fontSize: '12px',
            }}
          >
            <option value=""></option>
            {countries.map((country) => (
              <option value={country.en} key={country.en}>{country.en}</option>
            ))}
          </select>
          <IconButton $variant="save" onClick={saveCell} title="Uložiť">
            <FaSave />
          </IconButton>
          <IconButton $variant="cancel" onClick={cancelEdit} title="Zrušiť">
            <FaTimes />
          </IconButton>
        </div>
      );
    }

    if (editingCell?.cell === 'isAllowedGeneralOrder') {
      return (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', width: '100%' }}>
          <select
            autoFocus
            value={editingCell.value ? 'true' : 'false'}
            onChange={(e) => {
              setEditingCell((prev) => prev ? { ...prev, value: e.target.value === 'true' } : null);
            }}
            style={{
              flex: 1,
              minWidth: 0,
              padding: '4px 6px',
              borderRadius: '4px',
              border: '1px solid #44998a',
              outline: 'none',
              fontSize: '12px',
            }}
          >
            <option value="true">Áno</option>
            <option value="false">Nie</option>
          </select>
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
          value={editingCell?.value || ''}
          onChange={textFieldHandler((v) => void setEditingCell((prev) => prev ? { ...prev, value: v } : null))}
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

  const renderCell = (user: any, column: any) => {
    const rawValue = get(user, column.key !== 'country' ? column.key : 'country.en');
    let cellContent;

    if (column.key === 'isAllowedGeneralOrder') {
      const isAllowed = !!rawValue;
      cellContent = (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {isAllowed ? (
            <FaCheckCircle color="#10b981" size={16} title="Áno (True)" />
          ) : (
            <FaTimesCircle color="#ef4444" size={16} title="Nie (False)" />
          )}
        </div>
      );
    } else {
      cellContent = <>{rawValue}</>;
    }

    if (!column.readonly) {
      return (
        <EditableCellContainer>
          <div className="cell-content">{cellContent}</div>
          <FaPen
            className="edit-icon"
            onClick={() => setEditingCell({ userId: user.id, cell: column.key, value: get(user, column.key) })}
            title="Upraviť"
          />
        </EditableCellContainer>
      );
    }

    return cellContent;
  };

  const [favicon, setFavicon] = useState('/faviconOk.ico');
  const [pageTitle, setPageTitle] = useState('Users | OkiDoki Admin');
  
  useEffect(() => {
    if (window.location.href.includes('ukon')) {
      setFavicon('/faviconUkon.ico');
      setPageTitle('Users | Úkon Admin');
    } else {
      setFavicon('/faviconOk.ico');
      setPageTitle('Users | OkiDoki Admin');
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
        <ListTable columns={COLS.map((item) => item.title)}>
          {[...users].reverse().map((user) => (
            <ListTableRow key={user.id}>
              {COLS.map((col) => (
                <ListTableCell key={col.key}>
                  <div style={{ width: '100%', minWidth: 0 }}>
                    {editingCell?.cell === col.key && editingCell?.userId === user.id
                      ? renderEditingCell()
                      : renderCell(user, col)}
                  </div>
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