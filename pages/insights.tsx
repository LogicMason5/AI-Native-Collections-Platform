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
import {SmexyTokens} from '@/components/Tokens'


export default function Insights() {
    const [transactions, setTransactions] = useState<object>()
    const [tokens, setTokens] = useState<object>()
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
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const fetchData = async () => {
            const publicKey = await connectWallet(false, false)
            const res = await fetch(API_URL + "/fetch/tokens/" + publicKey.toString())
            const json = await res.json()
            setTokens({
                "Cryowar Token": {
                  "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HfYFjMKNZygfMC8LsQ8LtpPsPxEJoXJx4M6tqi75Hajo/logo.png",
                  "address": "HfYFjMKNZygfMC8LsQ8LtpPsPxEJoXJx4M6tqi75Hajo",
                  "amount": 1142231.082325765
                },
                "Solana INU": {
                  "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/5jFnsfx36DyGk8uVGrbXnVUMTsBkPXGpx6e69BiGFzko/logo.png",
                  "address": "5jFnsfx36DyGk8uVGrbXnVUMTsBkPXGpx6e69BiGFzko",
                  "amount": 500
                },
                "Serum": {
                  "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt/logo.png",
                  "address": "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
                  "amount": 263307.460371
                },
                "KIN": {
                  "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6/logo.png",
                  "address": "kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6",
                  "amount": 10963597597.92921
                },
                "Solareum": {
                  "logo": "https://solareum.app/icons/XSB-G.png",
                  "address": "4UuGQgkD3rSeoXatXRWwRfRd21G87d5LiCfkVzNNv1Tt",
                  "amount": 125
                },
                "Solanium": {
                  "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/xxxxa1sKNGwFtw2kFn8XauW9xq8hBZ5kVtcSesTT9fW/logo.png",
                  "address": "xxxxa1sKNGwFtw2kFn8XauW9xq8hBZ5kVtcSesTT9fW",
                  "amount": 21432.222392
                },
                "SolDoge": {
                  "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/8ymi88q5DtmdNTn2sPRNFkvMkszMHuLJ1e3RVdWjPa3s/logo.png",
                  "address": "8ymi88q5DtmdNTn2sPRNFkvMkszMHuLJ1e3RVdWjPa3s",
                  "amount": 1
                },
                "Project SEED Token": {
                  "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/6cVgJUqo4nmvQpbgrDZwyfd6RwWw5bfnCamS3M9N1fd/logo.png",
                  "address": "6cVgJUqo4nmvQpbgrDZwyfd6RwWw5bfnCamS3M9N1fd",
                  "amount": 380151.528515
                },
                "Only1 (LIKE)": {
                  "logo": "https://only1.io/like-token.svg",
                  "address": "3bRTivrVsitbmCTGtqwp7hxXPsybkjn4XLNtPsHqa3zR",
                  "amount": 1275146.382584458
                },
                "SolRazr": {
                  "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7j7H7sgsnNDeCngAPjpaCN4aaaru4HS7NAFYSEUyzJ3k/SOLR.png",
                  "address": "7j7H7sgsnNDeCngAPjpaCN4aaaru4HS7NAFYSEUyzJ3k",
                  "amount": 278684.346869
                },
                "Bitspawn Token": {
                  "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/5U9QqCPhqXAJcEv9uyzFJd5zhN93vuPk1aNNkXnUfPnt/logo.png",
                  "address": "5U9QqCPhqXAJcEv9uyzFJd5zhN93vuPk1aNNkXnUfPnt",
                  "amount": 1
                },
                "Aurory": {
                  "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/AURYydfxJib1ZkTir1Jn1J9ECYUtjb6rKQVmtYaixWPP/logo.png",
                  "address": "AURYydfxJib1ZkTir1Jn1J9ECYUtjb6rKQVmtYaixWPP",
                  "amount": 8286.877799828
                },
                "xHashtag Token": {
                  "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/5gs8nf4wojB5EXgDUWNLwXpknzgV2YWDhveAeBZpVLbp/logo.png",
                  "address": "5gs8nf4wojB5EXgDUWNLwXpknzgV2YWDhveAeBZpVLbp",
                  "amount": 793374.058968
                },
                "SolChicks": {
                  "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/cxxShYRVcepDudXhe7U62QHvw8uBJoKFifmzggGKVC2/logo.png",
                  "address": "cxxShYRVcepDudXhe7U62QHvw8uBJoKFifmzggGKVC2",
                  "amount": 10
                }
              })
        }
        fetchData()
    }, [])

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
                    <h3>Token distribution</h3>
                    <TokenDistributionChart chartData={tokens ? tokens : {}} />
                    <SmexyTokens data={tokens ? tokens: {}}/>
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

