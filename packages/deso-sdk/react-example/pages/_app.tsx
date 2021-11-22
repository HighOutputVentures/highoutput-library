import { DesoProvider } from '@glevinzon/deso-sdk';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DesoProvider>
      <Component {...pageProps} />
    </DesoProvider>
  );
}

export default MyApp;
