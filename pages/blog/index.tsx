import React, { useEffect, useState } from 'react';
import { BsFilePost } from 'react-icons/bs';
import { FaSpinner } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Post } from '@prisma/client';
import styled, { keyframes } from 'styled-components';

import Layout from 'components/Layout';
import { ListTableCell, ListTableRow } from 'components/ListTable';
import ListTable from 'components/ListTable/ListTable';

import { formatIso } from 'helpers/datetime';

import { getAuthProps } from 'lib/authProps';
import prisma from 'lib/prisma';

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

const COLS = [
  {
    value: 'name',
    label: 'Názov článku',
  },
  {
    value: 'titleImgUrl',
    label: 'Obrázok',
  },
  {
    value: 'id',
    label: 'ID',
  },
  {
    value: 'lang',
    label: 'Jazyk',
  },
  {
    value: 'publicationDate',
    label: 'Dátum publikácie',
  },
];

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const posts = await prisma.post.findMany({ orderBy: { publicationDate: 'desc' } });
  return {
    ...getAuthProps(ctx),
    props: { posts: posts.map((item) => ({ ...item, publicationDate: formatIso(item.publicationDate) })) },
  };
};

type Props = {
  posts: Post[];
}

const Blog = ({ posts }: Props) => {
  const router = useRouter();
  const [favicon, setFavicon] = useState('/faviconOk.ico');
  const [pageTitle, setPageTitle] = useState('Blog | OkiDoki Admin');

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsFetching(true);
    const handleComplete = () => setIsFetching(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  useEffect(() => {
    if (window.location.href.includes('ukon')) {
      setFavicon('/faviconUkon.ico');
      setPageTitle('Blog | Úkon Admin');
    } else {
      setFavicon('/faviconOk.ico');
      setPageTitle('Blog | OkiDoki Admin');
    }
  }, []);

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href={favicon} />
        <meta name="description" content="Úkon Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div style={{ marginBottom: 24 }}>
          <Link href="/blog/posts/new-post">
            <button
              disabled={isFetching}
              style={{ opacity: isFetching ? 0.6 : 1, cursor: isFetching ? 'not-allowed' : 'pointer' }}
            >
              <BsFilePost size={16}/>Nový článok
            </button>
          </Link>
        </div>

        {isFetching ? (
          <BigSpinnerContainer>
            <SpinnerIcon size={40} />
            <div>Načítavanie...</div>
          </BigSpinnerContainer>
        ) : (
          <ListTable columns={COLS.map((item) => item.label)}>
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/posts/${post.id}`}>
                <ListTableRow>
                  {COLS.map((col) => (
                    <ListTableCell
                      style={{ cursor: 'pointer' }}
                      key={col.value}
                    >
                      {post[col.value]}
                    </ListTableCell>
                  ))}
                </ListTableRow>
              </Link>
            ))}
          </ListTable>
        )}
      </main>
    </Layout>
  );
};

export default Blog;
