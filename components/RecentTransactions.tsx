import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/modules/RecentTransactions.module.scss'
import Sent from '@/images/Sent.svg'
import Received from '@/images/Received.svg'
import { connectWallet } from '@/components/Wallet'


export const RecentTransactions = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        let public_key ="8kgbAgt8oedfprQ9LWekUh6rbY264Nv75eunHPpkbYGX"
        if (window.solana._publicKey == null){
            public_key = await connectWallet(false)
        }
        const result = await fetch(`http://localhost:8000/fetch/activity/${public_key.toString()}?limit=6&&split_message=true`)
        const data = await result.json()
        console.log(data)
        setData(data)
      }
      fetchData()
    }, []);

    return (
        <div className={styles.recentTransactions}>
            <h2>Recent SOL transactions</h2>
            {data ? (data.map((a: any) => (
                    <div className={styles.transaction}>
                        <Image src={(a['type'] == "sent") ? Sent : Received} width="60" /> 
                        <p>{a['type']} {a['amount']} SOLs</p>
                    </div>
                    ))
                    )  : null
                        }
        </div>
    )
  }
  
  