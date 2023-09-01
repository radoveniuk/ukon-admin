import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Post as PostModel } from '@prisma/client';

import PostForm from 'components/forms/PostForm/PostForm';
import Layout from 'components/Layout';

import { formatIso } from 'helpers/datetime';

import { getAuthProps } from 'lib/authProps';
import prisma from 'lib/prisma';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = await prisma.post.findFirst({ where: { id: ctx.params.id as string } });
  return {
    ...getAuthProps(ctx),
    props: { post: { ...data, publicationDate: formatIso(data.publicationDate) } },
  };
};

const Post = ({ post }: {post: PostModel}) => {
  const router = useRouter();

  const submitHandler = (data: PostModel) => {
    fetch('/api/posts/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(() => {
      router.push('/blog');
    });
  };

  const deleteHandler = (post: PostModel) => {
    fetch('/api/posts/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: post.id }),
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
        <PostForm data={post} onSubmit={submitHandler} onDelete={deleteHandler} />
      </main>
    </Layout>
  );
};

export default Post;
