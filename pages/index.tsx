import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { getAuthProps } from 'lib/authProps';

import Layout from '../components/Layout';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    ...getAuthProps(ctx),
    props: {},
  };
};

const App = () => {
  return (
    <Layout>
      <Head>
        <title>Úkon Admin</title>
        <meta name="description" content="Úkon Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div style={{
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 40,
          color: '#306465',
        }}>
          Hello in the Ukon Admin Panel!
        </div>
      </main>
    </Layout>
  );
};

export default App;
