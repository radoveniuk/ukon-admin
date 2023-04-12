import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Layout from 'components/Layout';

import { ORDER_TYPES } from 'constants/orders-types';

const Orders = () => {
  return (
    <Layout>
      <Head>
        <title>Úkon Admin | Orders</title>
        <meta name="description" content="Úkon Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <div style={{ display: 'flex', gap: 20 }}>
          {ORDER_TYPES.map((orderType) => (
            <Link key={orderType.name} href={`/orders/${orderType.name}`}>{orderType.text}</Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
