import React, { useState, useEffect } from 'react'
import { PageHead } from '@/components/Head'
import { Sidebar } from '@/components/Sidebar'
import { connectWallet } from '@/components/Wallet';
import { TransactionChart, DistributionChart } from '@/components/Charts'
import Curves from '@/images/Curves.svg'
import Image from 'next/image'
import styles from '@/styles/modules/Insights.module.scss'

export default function Dashboard() {
    const [transactions, setTransactions] = useState(0)
    const [price, setPrice] = useState(0)
    const [ratio, setRatio] = useState([0, 0])
    const [balance, setBalance] = useState(0)

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const fetchData = async () => {
            let public_key = window.solana.publicKey
            if (window.solana._publicKey == null) {
                public_key = await connectWallet(false)
            }
            const result = await fetch(API_URL + "/fetch/transactions/" + public_key.toString())
            const data1 = await result.json()
            setTransactions(data1["transactions"])
            setRatio(data1["ratio"]);
            const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT")
            const data2 = await res.json()
            setPrice(data2["price"])

            const r = await fetch(`https://api.solscan.io/account?address=${public_key.toString()}`)
            const data3 = await r.json()
            //@ts-ignore
            setBalance(data3["data"]["lamports"] / 1000000000)
        }
        fetchData()
    }, []);

    return (
        <>
            <PageHead title={'NodeAir - Easier, faster & insightful Solana wallet experience.'} />
            <Sidebar />
            <h1 className={styles.note}>Insights is not available on this screen size at the moment.</h1>
            <div className={styles.insights}>
                <h1 className={styles.heading}>Insights</h1>
                <div className={styles.distributionChart}>
                    <DistributionChart chartData={ratio} />
                    <div className={styles.labels}>
                        <div className={styles.sent}>
                            <div></div>
                            {Math.round(ratio[1] / (ratio[0] + ratio[1]) * 100)}% SOLs received
                        </div>
                        <div className={styles.rec}>
                            <div></div>
                            {Math.round(ratio[0] / (ratio[0] + ratio[1]) * 100)}% SOLs sent
                        </div>
                    </div>
                </div>
                <div className={styles.numbers}>
                    <div className="content">
                        <h2>Numbers</h2>
                        <h1>Wallet balance<p>${balance * price}</p></h1>
                        <h1>Solana price<p>${price}</p></h1>
                    </div>
                    <Image className={styles.curves} src={Curves} height="100" width="800" alt="curves" />
                </div>
                <div className={styles.transactionChart}>
                    <TransactionChart chartData={transactions} />
                </div>

            </div>

        </>
    )
}

