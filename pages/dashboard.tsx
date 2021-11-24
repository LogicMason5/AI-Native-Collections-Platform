import React, { useState, useEffect } from 'react'
import { PageHead } from '@/components/Head'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { connectWallet } from '@/components/Wallet'
import { ViewChart } from '@/components/Charts'
import { Bookmarks } from '@/components/Bookmarks'
import { RecentTransactions } from '@/components/RecentTransactions'

import styles from '@/styles/modules/Dashboard.module.scss'

export default function Dashboard() {
    const [views, setViews] = useState('')
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const fetchData = async() => {
            let public_key = window.solana._publicKey
            if (window.solana._publicKey == null){
                public_key = await connectWallet(false)
            }
            const result = await fetch(API_URL + "/fetch/views/" + public_key.toString())
            const data = await result.json()
            setViews(data)
        }
        fetchData()
        }, []);

  return (
    <>
    <PageHead title={'NodeAir - Easier, faster & insightful Solana wallet experience.'} />
    <Sidebar/>
    <div className={styles.dashboard}>
        <h1 className={styles.heading}>Dashboard</h1>
        <div className={styles.viewChart}>
            <ViewChart chartData={views} />
        </div>
        <div className={styles.bookmarks}>
        <Bookmarks/>
        </div>
        <div className={styles.recentTransactions}>
            <RecentTransactions/>
        </div>
        <Link href="/insights"><a className={styles.insights}>View insights {'>'} </a></Link>
    </div>

    </>
  )
}

