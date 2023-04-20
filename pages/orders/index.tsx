import React from 'react';
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
