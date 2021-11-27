import Link from 'next/link'
import { connectWallet } from '@/components/Wallet'
import styles from '@/styles/modules/Navbar.module.scss'

export const Navbar = () => {
    return (
      <header className={styles.navbar}>
        <nav>
          <ul className={styles.links}>
            <Link href="/">Home</Link>
            <Link href="https://discord.gg/94zMschwDW">Support</Link>
            <Link href="https://api.nodeair.io">API</Link>
            {/* <Link href="/">Pricing</Link>
            <Link href="/">Guide</Link> */}
          </ul>
        </nav>
        <button className={styles.connectButton} onClick={() => connectWallet(true)}>Connect wallet</button>
      </header>
    )
  }
  
  