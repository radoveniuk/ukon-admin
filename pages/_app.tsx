import { AppProps } from 'next/app';

import 'styles/global.css';
import 'rc-dialog/assets/index.css';
import 'styles/PostPreview.scss';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Component {...pageProps} />
  );
};

export default App;
