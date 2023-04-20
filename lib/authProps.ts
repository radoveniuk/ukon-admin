import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';

const redirector = {
  redirect: {
    permanent: false,
    destination: '/auth',
  },
};

export const getAuthProps = ({ req, res }) => {
  const authCookie = getCookie('auth', { req, res });

  if (!authCookie) {
    return redirector;
  }
  try {
    jwt.verify(authCookie, process.env.NEXT_PUBLIC_JWT_SECRET);
    return {};
  } catch (error) {
    return redirector;
  }
};