import { ComponentType } from 'react';
import '@/styles/globals.scss'
import { ToastContainer } from 'react-toastify'
import {useEffect} from 'react'

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
  
  useEffect(() => {
    localStorage.clear()
  }, [])

  return (
    <>
    <ToastContainer theme="dark" position="bottom-right" autoClose={3000} closeOnClick={true} pauseOnHover={false} pauseOnFocusLoss={false}/>
    <Component {...pageProps} />
    </>
  )
}

export default App

