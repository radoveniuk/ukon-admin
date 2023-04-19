import { AppProps } from 'next/app';

import '../styles/global.css';
import 'rc-dialog/assets/index.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Component {...pageProps} />
  );
};

export default App;
