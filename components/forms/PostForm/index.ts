import dynamic from 'next/dynamic';

const WysiwygEditor = dynamic(
  () => import('./PostForm'),
  { ssr: false }
);

export default WysiwygEditor;