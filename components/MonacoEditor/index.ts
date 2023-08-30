import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(
  () => import('./MonacoEditor'),
  { ssr: false }
);

export default MonacoEditor;