import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Layout from 'components/Layout';

import { ORDER_TYPES } from 'constants/orders-types';

import { getAuthProps } from 'lib/authProps';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    ...getAuthProps(ctx),
    props: {},
  };
};

const Orders = () => {
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
      <div>
        <div className="order-tabs-nav">
          {ORDER_TYPES.map((orderType) => (
            <Link key={orderType.name} href={`/orders/${orderType.name}`}>{orderType.text}</Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
