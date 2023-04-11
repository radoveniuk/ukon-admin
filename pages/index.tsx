import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';

import Layout from '../components/Layout';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const authCookie = getCookie('auth', { req, res });

  if (!authCookie) {
    return { props: { auth: false } };
  }
  try {
    jwt.verify(authCookie, process.env.NEXT_PUBLIC_JWT_SECRET);
    return {
      props: { props: { auth: true } },
    };
  } catch (error) {
    return { props: { auth: false } };
  }
};

const App = (props) => {
  const router = useRouter();

  useEffect(() => {
    if (props.auth === false) {
      router.push('/auth');
    }
  }, [props.auth, router]);

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
