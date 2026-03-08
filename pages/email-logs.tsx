import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaSpinner,FaTimesCircle } from 'react-icons/fa';
import { MdEmail, MdRefresh } from 'react-icons/md';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Dialog from 'rc-dialog';
import styled, { keyframes } from 'styled-components';

import { ListTableCell, ListTableRow } from 'components/ListTable';
import ListTable from 'components/ListTable/ListTable';

import { getAuthProps } from 'lib/authProps';

import Layout from '../components/Layout';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerIcon = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;

const BigSpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: #44998a;
  gap: 16px;
  font-size: 18px;
  font-weight: 500;
`;

type EmailLogItem = {
  id: string;
  from: string;
  to: string[];
  subject: string;
  status: string;
  attempts: number;
  emailType: string;
  app: string;
  lang: string | null;
  hasAttachments: boolean;
  attachmentsCount: number;
  userId: string | null;
  errorMessage: string | null;
  deliveredAt: string | null;
  createdAt: string;
};

type Props = {
  logs: EmailLogItem[];
  total: number;
  page: number;
  limit: number;
  filter: {
    status: string;
    app: string;
    emailType: string;
    search: string;
  };
};

const COLS = [
  { key: 'createdAt', title: 'Dátum' },
  { key: 'status', title: 'Status' },
  { key: 'app', title: 'App' },
  { key: 'emailType', title: 'Typ' },
  { key: 'from', title: 'Od' },
  { key: 'to', title: 'Komu' },
  { key: 'subject', title: 'Predmet' },
  { key: 'attempts', title: 'Pokusy' },
  { key: 'attachments', title: 'Prílohy' },
  { key: 'lang', title: 'Jazyk' },
  { key: 'error', title: 'Chyba' },
  { key: 'actions', title: 'Zobraziť' },
];

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const page = parseInt((ctx.query.page as string) || '1', 10);
  const limit = 50;
  const filter = {
    status: (ctx.query.status as string) || '',
    app: (ctx.query.app as string) || '',
    emailType: (ctx.query.emailType as string) || '',
    search: (ctx.query.search as string) || '',
  };

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (filter.status) params.set('status', filter.status);
  if (filter.app) params.set('app', filter.app);
  if (filter.emailType) params.set('emailType', filter.emailType);
  if (filter.search) params.set('search', filter.search);

  const host = ctx.req.headers.host;
  const protocol = host?.startsWith('localhost') ? 'http' : 'https';
  const resp = await fetch(`${protocol}://${host}/api/email-logs?${params}`, {
    headers: { cookie: ctx.req.headers.cookie || '' },
  });

  const data = resp.ok ? await resp.json() : { logs: [], total: 0 };

  return {
    ...getAuthProps(ctx),
    props: { logs: data.logs, total: data.total, page, limit, filter },
  };
};

const STATUS_COLORS: Record<string, string> = {
  sent: '#10b981',
  failed: '#ef4444',
};

const EmailLogs = ({ logs, total, page, limit, filter }: Props) => {
  const router = useRouter();
  const totalPages = Math.ceil(total / limit);

  const [dialogLog, setDialogLog] = useState<EmailLogItem | null>(null);
  const [dialogBody, setDialogBody] = useState<string | null>(null);
  const [dialogLoading, setDialogLoading] = useState(false);

  const [localFilter, setLocalFilter] = useState(filter);

  const [isFetchingLogs, setIsFetchingLogs] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsFetchingLogs(true);
    const handleComplete = () => setIsFetchingLogs(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  const openDialog = async (log: EmailLogItem) => {
    setDialogLog(log);
    setDialogBody(null);
    setDialogLoading(true);
    try {
      const res = await fetch(`/api/email-logs?id=${log.id}`);
      const data = await res.json();
      setDialogBody(data.body ?? '');
    } catch {
      setDialogBody('<p style="color:red">Failed to load email body</p>');
    } finally {
      setDialogLoading(false);
    }
  };

  const closeDialog = () => {
    setDialogLog(null);
    setDialogBody(null);
  };

  const applyFilter = () => {
    const query: Record<string, string> = { page: '1' };
    if (localFilter.status) query.status = localFilter.status;
    if (localFilter.app) query.app = localFilter.app;
    if (localFilter.emailType) query.emailType = localFilter.emailType;
    if (localFilter.search) query.search = localFilter.search;
    router.push({ pathname: '/email-logs', query });
  };

  const resetFilter = () => {
    setLocalFilter({ status: '', app: '', emailType: '', search: '' });
    router.push('/email-logs');
  };

  const goToPage = (p: number) => {
    router.push({
      pathname: '/email-logs',
      query: { ...router.query, page: String(p) },
    });
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('sk-SK', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

  const [favicon, setFavicon] = useState('/faviconOk.ico');
  const [pageTitle, setPageTitle] = useState('Email Logs | OkiDoki Admin');

  useEffect(() => {
    if (window.location.href.includes('ukon')) {
      setFavicon('/faviconUkon.ico');
      setPageTitle('Email Logs | Úkon Admin');
    } else {
      setFavicon('/faviconOk.ico');
      setPageTitle('Email Logs | OkiDoki Admin');
    }
  }, []);

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={favicon} />
      </Head>
      <main>
        <div className="filters-bar">
          <div className="filters-row1">
            <select
              className="filter-control"
              value={localFilter.status}
              onChange={(e) => setLocalFilter((p) => ({ ...p, status: e.target.value }))}
            >
              <option value="">Všetky statusy</option>
              <option value="sent">sent</option>
              <option value="failed">failed</option>
            </select>

            <select
              className="filter-control"
              value={localFilter.app}
              onChange={(e) => setLocalFilter((p) => ({ ...p, app: e.target.value }))}
            >
              <option value="">Všetky app</option>
              <option value="ukon">ukon</option>
              <option value="oki-doki">oki-doki</option>
              <option value="order">order</option>
            </select>

            <select
              className="filter-control"
              value={localFilter.emailType}
              onChange={(e) => setLocalFilter((p) => ({ ...p, emailType: e.target.value }))}
            >
              <option value="">Všetky typy</option>
              <option value="registration">registration</option>
              <option value="verification">verification</option>
              <option value="password-reset">password-reset</option>
              <option value="payment">payment</option>
              <option value="order">order</option>
              <option value="feedback">feedback</option>
              <option value="invoice">invoice</option>
              <option value="activities">activities</option>
              <option value="signature">signature</option>
              <option value="document">document</option>
            </select>
          </div>

          <div className="filters-row">
            <input
              className="filter-control search-input"
              placeholder="Hľadať (predmet / email)..."
              value={localFilter.search}
              onChange={(e) => setLocalFilter((p) => ({ ...p, search: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
            />

            <button onClick={applyFilter} className="btn-primary" disabled={isFetchingLogs}>
              Filtrovať
            </button>

            <button onClick={resetFilter} className="btn-secondary" disabled={isFetchingLogs}>
              <MdRefresh size={16} /> Reset
            </button>

            <span className="total-count">
              Celkom: <strong>{total}</strong>
            </span>
          </div>
        </div>

        {isFetchingLogs ? (
          <BigSpinnerContainer>
            <SpinnerIcon size={40} />
            <div>Načítavanie...</div>
          </BigSpinnerContainer>
        ) : (
          <>
            <ListTable columns={COLS.map((c) => c.title)} stickyHeader>
              {logs.map((log) => (
                <ListTableRow
                  key={log.id}
                  onClick={() => openDialog(log)}
                  style={{ cursor: 'pointer' }}
                >
                  <ListTableCell style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                    {formatDate(log.createdAt)}
                  </ListTableCell>

                  <ListTableCell color={STATUS_COLORS[log.status] || undefined}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {log.status === 'sent' ? (
                        <FaCheckCircle size={14} />
                      ) : log.status === 'failed' ? (
                        <FaTimesCircle size={14} />
                      ) : null}
                      <strong>{log.status}</strong>
                    </div>
                  </ListTableCell>

                  <ListTableCell>{log.app}</ListTableCell>
                  <ListTableCell>{log.emailType}</ListTableCell>
                  <ListTableCell style={{ fontSize: 12 }}>{log.from}</ListTableCell>
                  <ListTableCell style={{ fontSize: 12 }}>
                    {log.to.join(', ')}
                  </ListTableCell>
                  <ListTableCell>{log.subject}</ListTableCell>
                  <ListTableCell style={{ textAlign: 'center' }}>
                    {log.attempts}
                  </ListTableCell>
                  <ListTableCell>
                    {log.hasAttachments ? `Áno (${log.attachmentsCount})` : '—'}
                  </ListTableCell>
                  <ListTableCell>{log.lang || '—'}</ListTableCell>
                  <ListTableCell
                    style={{
                      fontSize: 11,
                      color: '#ef4444',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={log.errorMessage || undefined}
                  >
                    {log.errorMessage || '—'}
                  </ListTableCell>
                  <ListTableCell style={{ cursor: 'pointer' }}>
                    <MdEmail size={18} color="#555" title="Zobraziť obsah" />
                  </ListTableCell>
                </ListTableRow>
              ))}
            </ListTable>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 20,
                  alignItems: 'center',
                }}
              >
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  style={btnStyle}
                >
                  ← Predch.
                </button>
                <span style={{ fontSize: 13 }}>
                  Strana {page} / {totalPages}
                </span>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  style={btnStyle}
                >
                  Ďalšia →
                </button>
              </div>
            )}
          </>
        )}

        {/* Email content dialog */}
        <Dialog
          visible={!!dialogLog}
          onClose={closeDialog}
          title={
            dialogLog ? `${dialogLog.subject} — ${dialogLog.to.join(', ')}` : ''
          }
          style={{ width: '80vw', maxWidth: 900 }}
          animation="zoom"
          maskAnimation="fade"
        >
          {dialogLog && (
            <div>
              {/* Meta info */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '6px 24px',
                  marginBottom: 16,
                  fontSize: 13,
                }}
              >
                <MetaRow label="Od" value={dialogLog.from} />
                <MetaRow label="Komu" value={dialogLog.to.join(', ')} />
                <MetaRow
                  label="Status"
                  value={
                    <span style={{ color: STATUS_COLORS[dialogLog.status], display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {dialogLog.status === 'sent' ? <FaCheckCircle size={12} /> : dialogLog.status === 'failed' ? <FaTimesCircle size={12} /> : null}
                      <strong>{dialogLog.status}</strong>
                    </span>
                  }
                />
                <MetaRow label="Pokusy" value={String(dialogLog.attempts)} />
                <MetaRow label="App" value={dialogLog.app} />
                <MetaRow label="Typ" value={dialogLog.emailType} />
                <MetaRow label="Jazyk" value={dialogLog.lang || '—'} />
                <MetaRow
                  label="Dátum"
                  value={formatDate(dialogLog.createdAt)}
                />
                {dialogLog.deliveredAt && (
                  <MetaRow
                    label="Doručené"
                    value={formatDate(dialogLog.deliveredAt)}
                  />
                )}
                {dialogLog.errorMessage && (
                  <MetaRow
                    label="Chyba"
                    value={
                      <span style={{ color: '#ef4444' }}>
                        {dialogLog.errorMessage}
                      </span>
                    }
                  />
                )}
                {dialogLog.hasAttachments && (
                  <MetaRow
                    label="Prílohy"
                    value={`${dialogLog.attachmentsCount} súbor(ov)`}
                  />
                )}
              </div>

              {/* Body preview */}
              <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 12 }}>
                {dialogLoading ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#44998a' }}>
                    <SpinnerIcon /> <p style={{ margin: 0 }}>Načítavanie...</p>
                  </div>
                ) : (
                  <iframe
                    srcDoc={dialogBody ?? ''}
                    style={{
                      width: '100%',
                      minHeight: 480,
                      border: '1px solid #ddd',
                      borderRadius: 4,
                    }}
                    sandbox="allow-same-origin"
                    title="Email preview"
                  />
                )}
              </div>
            </div>
          )}
        </Dialog>
      </main>

      <style jsx>{`
        main {
          padding-bottom: 40px;
        }
      `}</style>
    </Layout>
  );
};

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <span style={{ color: '#888', minWidth: 70 }}>{label}:</span>
      <span>{value}</span>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  padding: '4px 8px',
  fontSize: 13,
  border: '1px solid #ccc',
  borderRadius: 4,
  background: '#fff',
};

const btnStyle: React.CSSProperties = {
  padding: '4px 12px',
  fontSize: 13,
  cursor: 'pointer',
  border: '1px solid #ccc',
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

export default EmailLogs;
