import React, { useState, useEffect } from 'react';
import { PageHead } from '@/components/Head'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { connectWallet } from '@/components/Wallet';
import { TransactionChart } from '@/components/Charts'

import styles from '@/styles/modules/Dashboard.module.scss'

export default function Dashboard() {
    const [transactions, setTransactions] = useState('')
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    //@ts-ignore
    useEffect(async () => {
        let public_key = window.solana._publicKey
        if (window.solana._publicKey == null){
            public_key = await connectWallet(false)
        }
        const result = await fetch(API_URL + "/fetch/transactions/" + public_key.toString())
        const data = await result.json()
        console.log(data)
        setTransactions(data);
        }, []);

  return (
    <>
    <PageHead title={'NodeAir - Easier, faster & insightful Solana wallet experience.'} />
    <Navbar/>
    <Sidebar/>
    <div className={styles.dashboard}>
        <div className={styles.chart}>
            <TransactionChart chartData={transactions} />
        </div>
    </div>

    </>
  )
}

