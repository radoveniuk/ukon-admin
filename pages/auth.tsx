import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';

const Auth = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await res.json();

        if (res.ok) {
          router.push('/orders');
        } else {
          setError(data.error || 'Prístup zamietnutý');
        }
      } catch {
        setError('Chyba pri prihlásení');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google prihlásenie zlyhalo');
    },
  });

  const [favicon, setFavicon] = useState('/faviconOk.ico');
  const [pageTitle, setPageTitle] = useState('Auth | OkiDoki Admin');
  const [brandName, setBrandName] = useState('OkiDoki');
  const [otherName, setOtherName] = useState('Úkon');
  const [otherLink, setOtherLink] = useState('https://admin.ukon.sk/auth');

  useEffect(() => {
    if (window.location.href.includes('ukon')) {
      setFavicon('/faviconUkon.ico');
      setPageTitle('Auth | Úkon Admin');
      setBrandName('Úkon');
      setOtherName('OkiDoki');
      setOtherLink('https://admin.oki-doki.sk/');
    } else {
      setFavicon('/faviconOk.ico');
      setPageTitle('Auth | OkiDoki Admin');
      setBrandName('OkiDoki');
      setOtherName('Úkon');
      setOtherLink('https://admin.ukon.sk/');
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
        <div className="admin-card">
          <div className="admin-header">
            <div className="admin-header-sub">
              <div className="admin-brand">{brandName}</div>
              <a href={otherLink} className="admin-brand-other" target="_blank">{otherName}</a>
            </div>
            <h2>Admin Panel</h2>
            <p>Vitajte späť, prihláste sa pre pokračovanie.</p>
          </div>

          {error && (
            <div className="admin-error">{error}</div>
          )}

          <button
            className="admin-btn admin-btn-google"
            type="button"
            onClick={() => googleLogin()}
            disabled={loading}
          >
            <FcGoogle size={22} />
            {loading ? 'Prihlasovanie...' : 'Prihlásiť sa cez Google'}
          </button>
        </div>
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

          .admin-header-sub {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
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

          .admin-brand-other {
            display: inline-block;
            background-color: #e7e7e7;
            color: #717171;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
          }

          .admin-brand-other:hover {
            background-color: #44998A;
            color: #ffffff!important;
            text-decoration: none!important;
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

          .admin-error {
            background-color: #fef2f2;
            color: #dc2626;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            margin-bottom: 20px;
            text-align: center;
            border: 1px solid #fecaca;
          }

          .admin-btn-google {
            width: 100%;
          }

          .admin-btn-google:active:not(:disabled) {
            transform: translateY(0);
          }

          .admin-btn-google:disabled {
            opacity: 0.6;
            cursor: not-allowed;
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
