import { toast } from 'react-toastify'
import React, { useState, useEffect } from 'react'
import { PageHead } from '@/components/Head'
import { Sidebar } from '@/components/Sidebar'
import { connectWallet } from '@/components/Wallet';
import { TransactionChart, DistributionChart } from '@/components/Charts'
import { GetMonth } from '@/components/Utils'
import Curves2 from '@/images/Curves2.svg'
import Image from 'next/image'
import styles from '@/styles/modules/Insights.module.scss'

type Transaction = {
    _id: string
    blockTime: number,
    decimals: number,
    dst: string,
    fee: number,
    lamport: number,
    slot: number,
    src: string,
    status: string,
    txHahs: string,
    txNumberSolTransfer: number
}

export default function Dashboard() {
    const [public_key, setPublicKey] = useState<string>('')
    const [transactions, setTransactions] = useState<object>()
    const [ratio, setRatio] = useState([0, 0])
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
    const [monthNow] = useState(new Date().getMonth())
    const [price, setPrice] = useState(0)
    const [balance, setBalance] = useState(0)
    const [delay, setDelay] = useState<boolean>(false)

    const fetchNumbers = async () => {
        const publicKey = await connectWallet(false)
        setPublicKey(publicKey.toString())
        const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT")
        const price = await res.json()
        setPrice(price["price"])
        const r = await fetch(`https://api.solscan.io/account?address=${publicKey.toString()}`)
        const balance = await r.json()
        setBalance(balance["data"]["lamports"] / 1000000000)
    }

    useEffect(() => {
        fetchNumbers()
    }, []);


    useEffect(() => {
        const today = new Date()
        const fetchData = async () => {
            setDelay(true)
            setTimeout(
                () => setDelay(false),
                1000
            );
            const res = await fetch("https://api.solscan.io/account/soltransfer/" +
                `txs?address=${public_key}&offset=0&limit=500`)
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
                    if (date.getDate() == day && t.src == public_key) {
                        return t.lamport / 1000000000
                    }
                    return null
                }).filter(x => x != null)

                const received = transactions.map(t => {
                    let date = new Date(t.blockTime * 1000)
                    if (date.getDate() == day && t.dst == public_key) {
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
            if (ratio[0] != 0){
                sent = Math.round(ratio[0] / (ratio[0] + ratio[1]) * 100)
            }
            if (ratio[1] != 0) {
                received = Math.round(ratio[1] / (ratio[0] + ratio[1]) * 100)
            }
            setRatio([sent, received])
        }
        if (!delay) {
            fetchData()
        }

    }, [currentMonth]);

    return (
        <>
            <PageHead title={'NodeAir - Insights'} />
            <Sidebar />
            <h1 className={styles.note}>Insights is not available on this screen size at the moment.</h1>
            <div className={styles.insights}>
                <div className={styles.top}>
                    <h1 className={styles.heading} >Insights</h1>
                    <p className={styles.month} style={delay ? {opacity: "50%"} : {opacity: "100%"}}>
                        <span style={
                            currentMonth == 0 || delay ? { cursor: "default"} :
                                { cursor: "pointer" }} onClick={currentMonth == 0 || delay ? () => null : () => setCurrentMonth(currentMonth - 1)}>{'<'}</span>
                        {GetMonth(currentMonth)}
                        <span style={
                            currentMonth == monthNow || delay ? { cursor: "default"} :
                                { cursor: "pointer" }} onClick={currentMonth == monthNow || delay ? () => null : () => setCurrentMonth(currentMonth + 1)}>{'>'}</span>
                    </p>
                </div>

                <div className={styles.distributionChart}>
                    <DistributionChart chartData={ratio ? ratio : [1,1]} />
                    <div className={styles.labels}>
                        <div className={styles.sent}>
                            <div></div>
                            {ratio[1]}% SOLs received
                        </div>
                        <div className={styles.rec}>
                            <div></div>
                            {ratio[0]}% SOLs sent
                        </div>
                    </div>
                </div>
                <div className={styles.numbers}>
                    <div className={styles.content}>
                        <h2>Numbers</h2>
                        <h1>Wallet balance<p>${balance * price}</p></h1>
                        <h1>Solana price<p>${price}</p></h1>
                    </div>
                    <Image className={styles.curves} src={Curves2} alt="curves" />
                </div>
                <div className={styles.transactionChart}>
                    <TransactionChart chartData={transactions} />
                </div>

            </div>

        </>
    )
}

