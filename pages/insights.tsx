import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { PageHead } from '@/components/Head'
import { Sidebar } from '@/components/Sidebar'
import { connectWallet } from '@/components/Wallet';
import {
    TransactionChart,
    TransactionDistributionChart,
    TokenDistributionChart
} from '@/components/Charts'
import { GetMonth } from '@/utils/functions'
import { Transaction } from '@/utils/types'
import styles from '@/styles/pages/Insights.module.scss'


export default function Insights() {
    const [transactions, setTransactions] = useState<object>()
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth())
    const [price, setPrice] = useState<number>(0)
    const [ratio, setRatio] = useState<Array<number>>([0, 0])
    const [balance, setBalance] = useState<number>(0)
    const [delay, setDelay] = useState<boolean>(false)


    const fetchNumbers = async () => {
        const publicKey = await connectWallet(false, false)
        const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT")
        const price = await res.json()
        setPrice(price["price"])
        const r = await fetch(`https://api.solscan.io/account?address=${publicKey.toString()}`)
        const balance = await r.json()
        const lamports = balance["data"]["lamports"]
        if (lamports) {
            setBalance(lamports / 1000000000)
        } else {
            setBalance(0)
        }

    }

    useEffect(() => {
        const today = new Date()
        const fetchData = async () => {
            const publicKey = await connectWallet(false, true)
            setDelay(true)
            setTimeout(
                () => setDelay(false),
                1000
            );
            const res = await fetch("https://api.solscan.io/account/soltransfer/" +
                `txs?address=${publicKey}&offset=0&limit=500`)
            const json = await res.json()
            const raw_transactions: Array<Transaction> = json.data.tx.transactions
            const transactions = raw_transactions.filter(t => {
                let date = new Date(t.blockTime * 1000)
                return date.getMonth() == currentMonth
            })
            const days = transactions.map(t => {
                let date = new Date(t.blockTime * 1000)
                return date.getDate();
            })


            const getSent = (day: number) => {
                const sent = transactions.map(t => {
                    let date = new Date(t.blockTime * 1000)
                    if (date.getDate() == day && t.src == publicKey) {
                        return t.lamport / 1000000000
                    }
                    return null
                }).filter(x => x != null)

                const received = transactions.map(t => {
                    let date = new Date(t.blockTime * 1000)
                    if (date.getDate() == day && t.dst == publicKey) {
                        return t.lamport / 1000000000
                    }
                    return null
                }).filter(x => x != null)


                return [sent, received]
            }

            let data = {}
            let ratio = [0, 0]
            for (let i = 1; i <= new Date(today.getFullYear(), currentMonth, 0).getDate(); i++) {
                if (!days.includes(i)) {
                    data = { ...data, [i]: { "sent": 0, "received": 0 } }
                } else {
                    const sentOrReceived = getSent(i)//@ts-ignore
                    const sent = sentOrReceived[0].reduce((a, b) => a + b, 0) //@ts-ignore
                    const received = sentOrReceived[1].reduce((a, b) => a + b, 0)
                    data = { ...data, [i]: { "sent": sent, "received": received } }
                    if (sent || received != null) {
                        //@ts-ignore
                        ratio[0] += sent
                        //@ts-ignore
                        ratio[1] += received
                    }

                }
            }

            setTransactions(data)
            let sent = 0
            let received = 0
            if (ratio[0] != 0) {
                sent = Math.round(ratio[0] / (ratio[0] + ratio[1]) * 100)
            }
            if (ratio[1] != 0) {
                received = Math.round(ratio[1] / (ratio[0] + ratio[1]) * 100)
            }
            setRatio([sent, received])
        }

        currentMonth == today.getMonth() ? fetchNumbers() : null
        fetchData()
    }, [currentMonth]);



    return (
        <>
            <PageHead title={'NodeAir - Insights'} />
            <Sidebar />
            <h1 className={styles.note}>Insights is not available on this screen size at the moment.</h1>

            <main className={styles.insights}>
                <h1 className={styles.heading} >Insights</h1>

                <div className={styles.transactions}>
                    <h3>Solana Transactions</h3> 
                    <p style={delay ? { opacity: "50%" } : { opacity: "100%" }}>
                        <span style={currentMonth == 0 || delay ?
                            { cursor: "default", opacity: "50%" } :
                            { cursor: "pointer" }}
                            onClick={currentMonth == 0 || delay ?
                                () => null :
                                () => setCurrentMonth(currentMonth - 1)}>{'<'}
                        </span>
                        {GetMonth(currentMonth)}
                        <span style={currentMonth == new Date().getMonth() || delay ?
                            { cursor: "default", opacity: "50%" } :
                            { cursor: "pointer" }}
                            onClick={currentMonth == new Date().getMonth() || delay ?
                                () => null :
                                () => setCurrentMonth(currentMonth + 1)}>{'>'}
                        </span>
                    </p>
                    <TransactionChart chartData={transactions} />
                </div>

                <div className={styles.tokenDistribution}>
                    <TokenDistributionChart chartData={transactions} />
                </div>

                <div className={styles.transactionDistribution}>
                    <h3>Solana transaction distribution</h3>
                    <TransactionDistributionChart chartData={ratio ? ratio : [1, 1]} />
                    <div className={styles.labels}>
                        <div className={styles.sentLabel}>
                            <div></div>
                            Received {ratio[1]}% 
                        </div>
                        <div className={styles.receivedLabel}>
                            <div></div>
                            Sent {ratio[0]}% 
                        </div>
                    </div>
                </div>

                <div className={styles.numerics}>
                    <h3>Numerics</h3>
                    <div>
                        <p>Wallet balance<span>${Math.round(balance * price)}</span></p>
                        <p>Token count<span>15</span></p>
                        <p>NFT count<span>0{Math.round(balance * price)}</span></p>
                        <p>Price of 1 $SOL<span>${Math.round(price)}</span></p>
                    </div>
                </div>

            </main>

        </>
    )
}

