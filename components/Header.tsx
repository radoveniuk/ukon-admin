import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ROUTES = [
  { url: '/users', text: 'Používatelia' },
  { url: '/orders', text: 'Objednávky' },
  { url: '/email-logs', text: 'Email logy' },
  { url: '/blog', text: 'Blog' },
];

//const ROUTES = [
//  { url: '/', text: 'Home' },
//  { url: '/users', text: 'Users' },
//  { url: '/orders', text: 'Orders' },
//  { url: '/mailboxes', text: 'Mailboxes' },
//  { url: '/mails', text: 'Mails' },
//  { url: '/blog', text: 'Blog' },
//];

const Header: React.FC = () => {
  const router = useRouter();
  const isActive = (pathname) => router.pathname.includes(pathname);

  return (
    <nav className="main-header-nav">
      <div className="nav-links">
        {ROUTES.map((route) => (
          <Link key={route.url} href={route.url}>
            <a className={isActive(route.url) ? 'active' : ''}>{route.text}</a>
          </Link>
        ))}
        <div className="divider" />
        <Link key={'https://dash.bunny.net/storage'} href={'https://dash.bunny.net/storage'}>
          <a target="_blank" className="external-link">Bunny</a>
        </Link>
        <Link key={'https://docs.google.com/spreadsheets/d/1oePCjFSRoI6pVVRPjL8I18FiiK-94kKCCT1dzXBlqQU/edit#gid=721786308'} href={'https://docs.google.com/spreadsheets/d/1oePCjFSRoI6pVVRPjL8I18FiiK-94kKCCT1dzXBlqQU/edit#gid=721786308'}>
          <a target="_blank" className="external-link">CRM</a>
        </Link>
        <Link key={'https://docs.google.com/spreadsheets/d/1hzDcCeyk3gpDVBs_1WfaNn4L2qBREJJSaMP8yLQo898/edit#gid=156590612'} href={'https://docs.google.com/spreadsheets/d/1hzDcCeyk3gpDVBs_1WfaNn4L2qBREJJSaMP8yLQo898/edit#gid=156590612'}>
          <a target="_blank" className="external-link">DocsGen</a>
        </Link>
      </div>
    </nav>
  );
};

export default Header;
