import Link from 'next/link';
import Image from 'next/image'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import Sent from '@/images/Sent.svg'
import Received from '@/images/Received.svg'
import { connectWallet } from '@/components/Wallet'
import styles from '@/styles/modules/RecentTransactions.module.scss'


export const RecentTransactions = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const fetchData = async () => {

      const public_key = await connectWallet(false)
      const result = await fetch(API_URL + `/fetch/activity/${public_key.toString()}?limit=6&&split_message=true`)
      if (result.ok) {
        const data = await result.json()
        setData(data)
      } else {
        const json = await result.json()
        toast.error(json.error)
      }

    }
    fetchData()
  }, []);

  return (
    <div className={styles.recentTransactions}>
      <h2>Recent SOL transactions</h2>
      {data ? (data.map((a: any) => (
        <Link key={a['tx']} href={"https://solscan.io/tx/" + a['tx']}><a>
          <div className={styles.transaction}>
            <Image src={(a['type'] == "sent") ? Sent : Received} width="60" alt="transaction" />
            <p>{a['type']} {a['amount']} SOLs</p>
          </div>
        </a></Link>
      ))
      ) : null
      }
    </div>

  )
}

