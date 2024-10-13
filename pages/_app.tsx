import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { app } from '../firebase/config';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
