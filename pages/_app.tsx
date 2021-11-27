import { ComponentType } from 'react';
import '@/styles/globals.scss'

declare global {
  interface Window {
    solana: any;
  }
}

type Props = {
  Component: ComponentType<any>
  pageProps: any
}

function App({ Component, pageProps }: Props) {
  return <Component {...pageProps} />
}

export default App
