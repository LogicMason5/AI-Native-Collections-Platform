import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { PageHead } from '@/components/Head'
import { Sidebar } from '@/components/Sidebar'
import { ViewChart } from '@/components/Charts'
import { Bookmarks } from '@/components/Bookmarks'
import { connectWallet } from '@/components/Wallet'
import { Projects } from '@/components/Projects'
import { RecentTransactions } from '@/components/RecentTransactions'
import styles from '@/styles/pages/Dashboard.module.scss'


export default function Dashboard() {
    const [views, setViews] = useState()

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const fetchData = async () => {
            const publicKey = await connectWallet(false, false)
            const result = await fetch(API_URL + "/fetch/views/" + publicKey)
            if (result.ok) {
                const data = await result.json()
                setViews(data)
            } else {
                const json = await result.json()
                toast.error(json.error)
            }
        }
        setTimeout(() => fetchData(), 500)
    }, []);

    return (
        <>
            <PageHead title={'NodeAir | Dashboard'} />
            <Sidebar />
            <h1 className={styles.note}>Dashboard is not available on this screen size at the moment.</h1>

            <main className={styles.dashboard}>
                <h1 className={styles.heading}>Dashboard</h1>

                <div className={styles.viewChart}>
                    <h3>Profile views</h3>
                    <ViewChart chartData={views} />
                </div>
                <div className={styles.bookmarks}>
                    <Bookmarks />
                </div>
                <div className={styles.comingSoon}>
                    <h3>Projects</h3>
                    <Projects />
                </div>
                <div className={styles.recentTransactions}>
                    <h3>Recent transactions</h3>
                    <RecentTransactions />
                </div>
            </main>

        </>
    )
}
