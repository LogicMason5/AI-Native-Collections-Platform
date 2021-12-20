import { ComponentType } from 'react';
import '@/styles/globals.scss'
import { ToastContainer } from 'react-toastify'

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
  return (
    <>
    <ToastContainer theme="dark" position="bottom-left" autoClose={5000} closeOnClick={true} pauseOnHover={false} pauseOnFocusLoss={false}/>
    <Component {...pageProps} />
    </>
  )
}

export default App

