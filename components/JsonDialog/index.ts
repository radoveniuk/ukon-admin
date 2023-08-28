import dynamic from 'next/dynamic';

const JsonDialog = dynamic(
  () => import('./JsonDialog'),
  { ssr: false }
);

export default JsonDialog;