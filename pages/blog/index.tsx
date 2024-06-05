import React, { useState } from 'react';
import { BsFilePost } from 'react-icons/bs';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Post } from '@prisma/client';

import Layout from 'components/Layout';
import { ListTableCell, ListTableRow } from 'components/ListTable';
import ListTable from 'components/ListTable/ListTable';

import { formatIso } from 'helpers/datetime';

import { getAuthProps } from 'lib/authProps';
import prisma from 'lib/prisma';

const COLS = [
  {
    value: 'name',
    label: 'Názov článku',
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
  return (
    <Layout>
      <Head>
        <title>Úkon Admin | Blog</title>
        <meta name="description" content="Úkon Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
          <Link href="/blog/posts/new-post"><button><BsFilePost size={20} />Nový článok</button></Link>
        </div>
        <ListTable columns={COLS.map((item) => item.label)}>
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/posts/${post.id}`}>
              <ListTableRow>
                {COLS.map((col) => (
                  <ListTableCell
                    cursor={'pointer'}
                    key={col.value}
                  >
                    {post[col.value]}
                  </ListTableCell>
                ))}
              </ListTableRow>
            </Link>
          ))}
        </ListTable>
      </main>
    </Layout>
  );
};

export default Blog;
