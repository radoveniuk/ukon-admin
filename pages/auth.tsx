import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import textFieldHandler from '../helpers/textFieldHandler';


const Auth = () => {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, pass }),
    }).then(() => {
      router.push('/orders');
    });
  };

  return (
    <>
      <Head>
        <title>Úkon Admin</title>
        <meta name="description" content="Úkon Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 300, margin: '300px auto' }}>
        <input placeholder="login" value={login} onChange={textFieldHandler(setLogin)} name="login" type="text" />
        <input placeholder="pass" name="pass" value={pass} onChange={textFieldHandler(setPass)} type="password" />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Auth;
