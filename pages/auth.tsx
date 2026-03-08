import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import textFieldHandler from '../helpers/handlers';

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

  const [favicon, setFavicon] = useState('/faviconOk.ico');
  const [pageTitle, setPageTitle] = useState('Auth | OkiDoki Admin');
  const [brandName, setBrandName] = useState('OkiDoki');

  useEffect(() => {
    if (window.location.href.includes('ukon')) {
      setFavicon('/faviconUkon.ico');
      setPageTitle('Auth | Úkon Admin');
      setBrandName('Úkon');
    } else {
      setFavicon('/faviconOk.ico');
      setPageTitle('Auth | OkiDoki Admin');
      setBrandName('OkiDoki');
    }
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Admin Panel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={favicon} />
      </Head>

      <div className="admin-wrapper">
        <form className="admin-card" onSubmit={submitHandler}>
          <div className="admin-header">
            <div className="admin-brand">{brandName}</div>
            <h2>Admin Panel</h2>
            <p>Vitajte späť, prihláste sa pre pokračovanie.</p>
          </div>

          <div className="admin-form-group">
            <label>Login</label>
            <input
              className="admin-input"
              placeholder="Enter your login"
              value={login}
              onChange={textFieldHandler(setLogin)}
              name="login"
              type="text"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Heslo</label>
            <input
              className="admin-input"
              placeholder="••••••••"
              name="pass"
              value={pass}
              onChange={textFieldHandler(setPass)}
              type="password"
              required
            />
          </div>

          <button className="admin-btn" type="submit">Prihlásiť sa</button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #f8fafb;
          }

          .admin-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
          }

          .admin-card {
            background: #ffffff;
            width: 100%;
            max-width: 400px;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(226, 232, 240, 0.8);
            box-sizing: border-box;
          }

          .admin-header {
            text-align: center;
            margin-bottom: 32px;
          }

          .admin-brand {
            display: inline-block;
            background-color: #ecfdf5;
            color: #44998A;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
          }

          .admin-header h2 {
            margin: 0 0 8px 0;
            color: #131313;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }

          .admin-header p {
            margin: 0;
            color: #717171;
            font-size: 15px;
          }

          .admin-form-group {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
          }

          .admin-form-group label {
            font-size: 14px;
            font-weight: 500;
            color: #131313;
            margin-bottom: 8px;
          }

          .admin-input {
            width: 100%;
            padding: 14px 16px;
            border-radius: 12px;
            border: 1px solid transparent;
            background-color: #f1f5f9;
            font-size: 15px;
            color: #131313;
            outline: none;
            transition: all 0.2s ease;
            box-sizing: border-box;
          }

          .admin-input::placeholder {
            color: #94a3b8;
          }

          .admin-input:focus {
            background-color: #ffffff;
            border-color: #44998A;
            box-shadow: 0 0 0 4px rgba(68, 153, 138, 0.1);
          }

          .admin-btn {
            width: 100%;
            padding: 14px;
            margin-top: 12px;
            background-color: #44998A;
            color: #ffffff;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .admin-btn:hover {
            background-color: #3b8678;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(68, 153, 138, 0.25);
          }

          .admin-btn:active {
            transform: translateY(0);
          }

          @media (max-width: 480px) {
            .admin-card {
              padding: 30px 20px;
              border-radius: 16px;
            }
          }
        ` }
      } />
    </>
  );
};

export default Auth;
