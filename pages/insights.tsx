import React, { useState, useEffect } from 'react'
import { PageHead } from '@/components/Head'
import { Sidebar } from '@/components/Sidebar'
import { connectWallet } from '@/components/Wallet';
import { TransactionChart, DistributionChart } from '@/components/Charts'
import Curves from '@/images/Curves.svg'
import Image from 'next/image'
import styles from '@/styles/modules/Insights.module.scss'

export default function Dashboard() {
    const [transactions, setTransactions] = useState('')
    const [ratio, setRatio] = useState('')
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const fetchData = async() => {
            let public_key = window.solana._publicKey
            if (window.solana._publicKey == null){
                public_key = await connectWallet(false)
            }
            const result = await fetch(API_URL + "/fetch/transactions/" + public_key.toString())
            const data = await result.json()
            setTransactions(data["transactions"])
            setRatio(data["ratio"]);
        }
        fetchData()
        }, []);

  return (
    <>
    <PageHead title={'NodeAir - Easier, faster & insightful Solana wallet experience.'} />
    <Sidebar/>
    <div className={styles.insights}>
        <h1 className={styles.heading}>Insights</h1>
        <div className={styles.distributionChart}>
            <DistributionChart chartData={ratio} />
            <div><div></div> 25% Received</div>
            <div><div></div> 75% sent</div>
        </div>
        <div className={styles.numbers}>
            <Image src={Curves}></Image>
        </div>
        <div className={styles.transactionChart}>
            <TransactionChart chartData={transactions} />
        </div>

    </div>

    </>
  )
}

