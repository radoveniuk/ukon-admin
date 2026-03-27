import { AppProps } from 'next/app';
import { GoogleOAuthProvider } from '@react-oauth/google';

import 'styles/global.css';
import 'rc-dialog/assets/index.css';
import 'styles/PostPreview.scss';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID as string}>
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
};

export default App;
