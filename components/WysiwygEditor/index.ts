import dynamic from 'next/dynamic';

const WysiwygEditor = dynamic(
  () => import('./WysiwygEditor'),
  { ssr: false }
);

export default WysiwygEditor;