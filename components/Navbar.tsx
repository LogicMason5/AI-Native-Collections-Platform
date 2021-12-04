import Link from 'next/link'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import { connectWallet } from '@/components/Wallet'
import styles from '@/styles/modules/Navbar.module.scss'

export const Navbar = () => {

  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [publicKey, setPublicKey] = useState<string>('')

  const handleConnect = async() => {
    try{
      const res = await window.solana.connect({ onlyIfTrusted: true })
      setLoggedIn(true)
      let start = res.publicKey.toString().substring(0, 5)
      let end = res.publicKey.toString().substring(39, 44)
      setPublicKey(start + "..." + end)
    } catch {
      return
    }
  }

  useEffect(() => {
    handleConnect()
  }, []);


  return (
    <header className={styles.navbar}>
      <nav>
        <ul className={styles.links}>
          <Link href="/">Home</Link>
          <Link href="https://discord.gg/94zMschwDW">Support</Link>
          <Link href="https://api.nodeair.io">API</Link>
          {/* <Link href="/">Pricing</Link> */}
        </ul>
      </nav>
      {loggedIn ?
      <button className={styles.connectButton} onClick={() => Router.push("/dashboard")}><div></div>{publicKey}</button>:
      <button className={styles.connectButton} onClick={() => handleConnect()}>Connect wallet</button>
      }
    </header>
  )
}

