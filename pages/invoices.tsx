import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import Layout from 'components/Layout';
import ListTable, { ListTableCell, ListTableRow } from 'components/ListTable';

import { getAuthProps } from 'lib/authProps';
import prisma from 'lib/prisma';

type Invoice = {
  id: string;
  createdAt: string;
  supplierName: string;
  clientName: string;
  invoiceNumber: string;
  invoiceDate: string;
  pageUrl: string;
  app: string;
  userId: string | null;
  userName: string | null;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const invoices = await prisma.generatedInvoice.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return {
    ...getAuthProps(ctx),
    props: {
      invoices: JSON.parse(JSON.stringify(invoices)),
    },
  };
};

type Props = {
  invoices: Invoice[];
};

const COLUMNS = [
  'Dátum vytvorenia',
  'Dodávateľ',
  'Odberateľ',
  'Číslo faktúry',
  'Dátum faktúry',
  'Aplikácia',
  'Používateľ',
  'Odkaz',
];

const Invoices = ({ invoices }: Props) => {
  const [favicon, setFavicon] = useState('/faviconOk.ico');
  const [pageTitle, setPageTitle] = useState('Faktúry | OkiDoki Admin');

  useEffect(() => {
    if (window.location.href.includes('ukon')) {
      setFavicon('/faviconUkon.ico');
      setPageTitle('Faktúry | Úkon Admin');
    } else {
      setFavicon('/faviconOk.ico');
      setPageTitle('Faktúry | OkiDoki Admin');
    }
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('sk-SK', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Vygenerované faktúry" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={favicon} />
      </Head>
      <main>
        <h2
          style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#1e293b' }}
        >
          Vygenerované faktúry ({invoices.length})
        </h2>
        <ListTable columns={COLUMNS}>
          {invoices.map((invoice) => (
            <ListTableRow key={invoice.id}>
              <ListTableCell>{formatDate(invoice.createdAt)}</ListTableCell>
              <ListTableCell>{invoice.supplierName}</ListTableCell>
              <ListTableCell>{invoice.clientName}</ListTableCell>
              <ListTableCell>{invoice.invoiceNumber}</ListTableCell>
              <ListTableCell>{invoice.invoiceDate}</ListTableCell>
              <ListTableCell>{invoice.app || '—'}</ListTableCell>
              <ListTableCell>{invoice.userName || '—'}</ListTableCell>
              <ListTableCell>
                <a
                  href={invoice.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="table-link"
                >
                  Otvoriť
                </a>
              </ListTableCell>
            </ListTableRow>
          ))}
        </ListTable>
      </main>
    </Layout>
  );
};

export default Invoices;
