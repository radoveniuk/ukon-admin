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

  return (
    <Layout>
      <Head>
        <title>Úkon Admin | New post</title>
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
