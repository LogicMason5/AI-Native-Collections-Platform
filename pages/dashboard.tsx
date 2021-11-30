import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { PageHead } from '@/components/Head'
import { Sidebar } from '@/components/Sidebar'
import { connectWallet } from '@/components/Wallet'
import { ViewChart } from '@/components/Charts'
import { Bookmarks } from '@/components/Bookmarks'
import { NFTGallery } from '@/components/NFTGallery'
import { RecentTransactions } from '@/components/RecentTransactions'
import styles from '@/styles/modules/Dashboard.module.scss'


export default function Dashboard() {
    const [views, setViews] = useState()
    // Need to do error handling
    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const fetchData = async () => {
            const publicKey = await connectWallet(false)
            const result = await fetch(API_URL + "/fetch/views/" + publicKey.toString())
            const data = await result.json()
            setViews(data)
        }
        fetchData()
    }, []);

    return (
        <>
            <PageHead title={'NodeAir | Dashboard'} />
            <Sidebar />
            <h1 className={styles.note}>Dashboard is not available on this screen size at the moment.</h1>

            <div className={styles.dashboard}>
                <h1 className={styles.heading}>Dashboard</h1>
                <div className={styles.viewChart}>
                    <ViewChart chartData={views} />
                </div>
                <div className={styles.bookmarks}>
                    <Bookmarks />
                </div>
                <div className={styles.comingSoon}>
                    <NFTGallery />
                </div>
                <div className={styles.recentTransactions}>
                    <RecentTransactions />
                </div>
                <Link href="/insights"><a className={styles.insights}>View insights {'>'} </a></Link>
            </div>

        </>
    )
}

