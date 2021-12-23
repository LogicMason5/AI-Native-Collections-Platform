import Link from 'next/link';
import Image from 'next/image'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import Sent from '@/images/Sent.svg'
import Received from '@/images/Received.svg'
import { connectWallet } from '@/components/Wallet'
import styles from '@/styles/modules/RecentTransactions.module.scss'
import { timeSince } from "@/utils/functions"

export const RecentTransactions = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const fetchData = async () => {

      const public_key = await connectWallet(false)
      const result = await fetch(API_URL + `/transactions/activity/${public_key}?limit=6&&split_message=true`)
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
      <div className={styles.labels}>
        <p>Amount</p>
        <p>To/From</p>
        <p>Time</p>
      </div>
      {data ? (data.map((a) => (
        <Link key={a['tx']} href={"https://solscan.io/tx/" + a['tx']}><a>
          <div className={styles.transaction}>
            <div className={styles.type}>
              <Image src={(a['type'] == "sent") ? Sent : Received} width="40" height="40" alt="transaction" />
              <p>{a['amount'] + " SOLS"}</p>
            </div>
            <div className={styles.metadata}>
              <p>{(a['type'] == "sent") ? //@ts-ignore
                a['to'].replace(a['to'].slice(5, 40), "...") : a['from'].replace(a['from'].slice(5, 40), "...")}
              </p>
              <p>{timeSince(new Date(a['time'] * 1000))}</p>
            </div>

          </div>

        </a></Link>
      ))
      ) : null
      }
    </div>

  )
}

