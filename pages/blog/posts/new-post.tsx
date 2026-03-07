import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Post as PostModel } from '@prisma/client';

import PostForm from 'components/forms/PostForm/PostForm';
import Layout from 'components/Layout';

const Post = () => {
  const router = useRouter();

  const submitHandler = (data: PostModel) => {
    fetch('/api/posts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(() => {
      router.push('/blog');
    });
  };

  const [favicon, setFavicon] = useState('/faviconOk.ico');
  const [pageTitle, setPageTitle] = useState('Post | OkiDoki Admin');
  
  useEffect(() => {
    if (window.location.href.includes('ukon')) {
      setFavicon('/faviconUkon.ico');
      setPageTitle('Post | Úkon Admin');
    } else {
      setFavicon('/faviconOk.ico');
      setPageTitle('Post | OkiDoki Admin');
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
        <PostForm onSubmit={submitHandler} />
      </main>
    </Layout>
  );
};

export default Post;
