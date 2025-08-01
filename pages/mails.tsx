import React, { useState } from 'react';
import { BiMailSend, BiTrash, BiUpload } from 'react-icons/bi';
import { FaSave } from 'react-icons/fa';
import { MdPreview } from 'react-icons/md';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
// import { Mail, VirtualAddress } from '@prisma/client';
import get from 'lodash.get';
import set from 'lodash.set';

import FileInput from 'components/FileInput';
import { ListTableCell, ListTableRow } from 'components/ListTable';
import ListTable from 'components/ListTable/ListTable';
import { Select } from 'components/Select';

import STATUSES from 'data/mail-statuses.json';

import { getToday } from 'helpers/datetime';
import { sendFile } from 'helpers/files';
import textFieldHandler from 'helpers/handlers';

import prisma from 'lib/prisma';

import Layout from '../components/Layout';

const COLS = [
  {
    key: 'from',
    title: 'From',
  },
  {
    key: 'fromAddress',
    title: 'From address',
  },
  {
    key: 'date',
    title: 'Date',
  },
  {
    key: 'status',
    title: 'Status',
    render: (row) => <>{STATUSES.find(item => item.id === row.status)?.title || row.status}</>,
  },
];


type EditCell = {
  mailId: string;
  cell: string;
  value: any;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const mailBoxes = await prisma.virtualAddress.findMany({
    include: { user: true },
  });
  const mails = await prisma.mail.findMany({
    include: { virtualAddress: { include: { user: true } } },
  });
  return {
    props: { mailBoxes, mails },
  };
};
// TODO FIX
type Props = {
  mailBoxes: any[];
  mails: any[];
}

const Mails = ({ mailBoxes, mails }: Props) => {
  // TODO FIX
  const [selectedMailBox, setSelectedMailBox] = useState<any>(null);
  const [selectedMailBoxMails, setSelectedMailBoxMails] = useState<any[]>([]);
  const [disableCreate, setDisableCreate] = useState(true);
  const [editingCell, setEditingCell] = useState<null | EditCell>(null);

  const createMail = () => {
    setDisableCreate(true);
    fetch('/api/mails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ virtualAddressId: selectedMailBox.id, date: getToday(), status: 'received' }),
    })
      .then((res) => res.json())
      .then((res) => {
        setSelectedMailBoxMails((prev) => [res, ...prev]);
        setDisableCreate(false);
      });
  };

  const deleteMail = (id: string) => {
    fetch('/api/mails', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then(() => {
        setSelectedMailBoxMails((prev) => prev.filter((item) => item.id !== id));
      });
  };

  const updateCell = (mailId: string, cell: string, value: any) => {
    const mailToUpdate = selectedMailBoxMails.find((item) => item.id === mailId);
    set(mailToUpdate, cell, value);
    setSelectedMailBoxMails((prev) => prev.map((item) => item.id === mailId ? mailToUpdate : item));
    return fetch('/api/mails', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [cell]: value, id: mailId }),
    });
  };

  const saveCell = () => {
    updateCell(editingCell.mailId, editingCell.cell, editingCell.value).then(() => {
      setEditingCell(null);
    });
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
        <title>Úkon Admin | Mails</title>
        <meta name="description" content="Úkon Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
          <Select
            options={mailBoxes.map((item: any) => ({ value: item.id, text: `${item.businessName}` }))}
            onChange={({ value }) => {
              setSelectedMailBox(mailBoxes.find((item) => item.id === value));
              setDisableCreate(false);
              setSelectedMailBoxMails(mails.filter((item) => item.virtualAddressId === value));
            }}
            value={selectedMailBox?.id || ''}
          />
          <button disabled={disableCreate} onClick={createMail}><BiMailSend size={20} />New mail {selectedMailBox && `to ${selectedMailBox.businessName}`}</button>
        </div>
        {!!selectedMailBoxMails.length && (
          <ListTable columns={[...COLS.map((item) => item.title), 'Mail face scan', 'Content scan', 'Actions']}>
            {selectedMailBoxMails.map((item) => (
              <ListTableRow key={item.id}>
                {COLS.map((col) => (
                  <ListTableCell
                    key={col.key}
                    onDoubleClick={() => { setEditingCell({ mailId: item.id, cell: col.key, value: get(item, col.key) }); }}
                  >
                    {(editingCell?.cell === col.key && editingCell?.mailId === item.id) ? renderEditingCell() : renderCell(item, col)}
                  </ListTableCell>
                ))}
                <ListTableCell style={{ flexDirection: 'row', gap: 15 }}>
                  {!!item.mailUrl && (
                    <a title="View" href={`/api/files?id=${item.mailUrl}`} download><MdPreview size={20} /></a>
                  )}
                  <FileInput id={`face-${item.id}`} onChange={(e) => void sendFile(e.target.files?.[0]).then((filename) => void updateCell(item.id, 'mailUrl', filename))}>
                    <div
                      role="button"
                      title="Upload"
                    >
                      <BiUpload size={20} />
                    </div>
                  </FileInput>
                </ListTableCell>
                <ListTableCell style={{ flexDirection: 'row', gap: 15 }}>
                  {!!item.contentUrl && (
                    <a title="View" href={`/api/files?id=${item.contentUrl}`} download><MdPreview size={20} /></a>
                  )}
                  <FileInput id={`content-${item.id}`} onChange={(e) => void sendFile(e.target.files?.[0]).then((filename) => void updateCell(item.id, 'contentUrl', filename))}>
                    <div
                      role="button"
                      title="Upload"
                    >
                      <BiUpload size={20} />
                    </div>
                  </FileInput>
                </ListTableCell>
                <ListTableCell>
                  <div
                    role="button"
                    title="Delete"
                    onClick={() => {
                      const answer = window?.confirm('Delete mail?');
                      if (answer) {
                        deleteMail(item.id);
                      }
                    }}
                  >
                    <BiTrash color="#c04c4c" size={20} />
                  </div>
                </ListTableCell>
              </ListTableRow>
            ))}
          </ListTable>
        )}
      </main>
    </Layout>
  );
};

export default Mails;
