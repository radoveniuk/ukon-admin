import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ROUTES = [
  { url: '/', text: 'Home' },
  { url: '/users', text: 'Users' },
  { url: '/orders', text: 'Orders' },
  { url: '/mailboxes', text: 'Mailboxes' },
  { url: '/mails', text: 'Mails' },
  { url: '/blog', text: 'Blog' },
];

const Header: React.FC = () => {
  const router = useRouter();
  const isActive = (pathname) => router.pathname.includes(pathname);

  return (
    <nav>
      <div style={{ display: 'flex', gap: 20 }}>
        {ROUTES.map((route) => <Link key={route.url} href={route.url}><a className={isActive(route.url) && 'active'}>{route.text}</a></Link>)}
      </div>
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }
      `}</style>
    </nav>
  );
};

export default Header;
