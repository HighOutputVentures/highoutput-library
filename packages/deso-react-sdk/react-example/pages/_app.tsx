import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { DesoProvider } from '@glevinzon/deso-react-sdk';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DesoProvider>
      <Component {...pageProps} />
    </DesoProvider>
  );
}

export default MyApp;
