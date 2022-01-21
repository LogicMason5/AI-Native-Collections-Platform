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
import { Tokens } from '@/components/Tokens'
import { Loading } from '@/components/Loading';
import { toast } from 'react-toastify';
import styles from '@/styles/pages/Insights.module.scss'


export default function Insights() {
    const [transactions, setTransactions] = useState<object>()
    const [tokens, setTokens] = useState<object>()

    const [ratio, setRatio] = useState<Array<number>>([0, 0])
    const [numericsData, setNumericsData] = useState<any>()

    const [currentDate, setCurrentDate] = useState<Date>(new Date())
    const [delay, setDelay] = useState<boolean>(false)
    const [chartType, setChartType] = useState<boolean>(true)
    const [byAmount, setByAmount] = useState<boolean>(false)
    //  const [plan, setPlan] = useState<number>(0)


    const fetchTransactionData = async () => {
        const publicKey = await connectWallet(false, false)
        setDelay(true)
        setTimeout(
            () => setDelay(false),
            1000
        );
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(API_URL + `/transactions/${publicKey}/${currentDate.getFullYear()}/${currentDate.getMonth()}`)
        const json = await res.json()
        if (!res.ok) {
            toast.error(json.error)
        } else {
            setTransactions(json.transactions)
            setRatio([json.ratio[0], json.ratio[1]])
        }
    }

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const fetchData = async () => {
            const localStorageNumerics = localStorage.getItem("numerics")
            const localStorageTokens = localStorage.getItem("tokens")
            if (!localStorageTokens || !localStorageNumerics) {
                const publicKey = await connectWallet(false, false)
                const res = await fetch(API_URL + "/fetch/tokens/" + publicKey)
                const json = await res.json()
                setTokens(json["tokenData"])

                const numericsData = {
                    "fungibleTokenCount": json["fungibleTokenCount"],
                    "nftCount": json["nftCount"],
                    "unfetchedTokenCount": json["unfetchedTokenCount"],
                    "solPrice": json["solPrice"],
                    "walletValue": json["walletValue"]
                }
                setNumericsData(numericsData)
                localStorage.setItem("numerics", JSON.stringify(numericsData))
                localStorage.setItem("tokens", JSON.stringify(json["tokenData"]))
            } else {
                setTokens(JSON.parse(localStorageTokens))
                setNumericsData(JSON.parse(localStorageNumerics))
            }
        }

        if (window.solana) {
            fetchTransactionData()
            fetchData()
        } else {
            setTimeout(() => {
                fetchTransactionData()
                fetchData()
            }, 500)
        }
    }, [])

    return (
        <>
            <PageHead title={'NodeAir | Insights'} />
            <Sidebar />
            <h1 className={styles.note}>Insights is not available on this screen size at the moment.</h1>

            <main className={styles.insights}>
                <h1 className={styles.heading} >Insights</h1>

                <div className={styles.transactions}>
                    <h3>Solana Transactions</h3>

                    <div className={styles.sliderParent} >
                        <p>Line chart</p>
                        <label className={styles.switch}>
                            <input type="checkbox" className={styles.input} onClick={() => setChartType(!chartType)} />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    <p style={delay ? // || ![10, 15].includes(plan)? 
                        { opacity: "50%" } : { opacity: "100%" }}>
                        <span style={delay ?
                            { cursor: "default", opacity: "50%" } :
                            { cursor: "pointer" }}
                            onClick={delay ? // || ![10, 15].includes(plan) ?
                                () => null :
                                () => {
                                    setCurrentDate((currentDate) => { currentDate.setMonth(currentDate.getMonth() - 1); return currentDate })
                                    fetchTransactionData()
                                }

                            }>{'<'}
                        </span>
                        {GetMonth(currentDate.getMonth())} {currentDate.getFullYear()}
                        <span style={currentDate.getMonth() == new Date().getMonth() && currentDate.getFullYear() == new Date().getFullYear() || delay ?
                            { cursor: "default", opacity: "50%" } :
                            { cursor: "pointer" }}
                            onClick={currentDate.getMonth() == new Date().getMonth() && currentDate.getFullYear() == new Date().getFullYear() || delay ? //|| ![10, 15].includes(plan) ?
                                () => null :
                                () => {
                                    setCurrentDate((currentDate) => { currentDate.setMonth(currentDate.getMonth() + 1); return currentDate })
                                    fetchTransactionData()
                                }
                            }>{'>'}
                        </span>
                    </p>

                    <TransactionChart chartData={transactions} type={chartType ? 'bar' : 'line'} />
                </div>

                <div className={styles.tokenDistribution}>
                    <h3>Token Distribution</h3>
                    <div className={styles.tokenSliderParent} >
                        <p>Show by {byAmount ? 'value' : 'amount'}</p>
                        <label className={styles.switch}>
                            <input type="checkbox" className={styles.input} onClick={() => setByAmount(!byAmount)} />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                    {tokens && numericsData ?
                        <div>
                            <div><TokenDistributionChart chartData={tokens} byAmount={byAmount} /></div>
                            <Tokens data={tokens}
                                unfetchedTokenCount={numericsData["unfetchedTokenCount"]}
                                byAmount={byAmount}
                            />
                        </div> : <Loading />}
                </div>

                <div className={ratio && ratio[0] != 0 && ratio[1] != 0 ? styles.transactionDistribution : styles.transactionDistributionNull}>
                    <h3>Solana Transaction Distribution</h3>
                    {ratio && ratio[0] != 0 && ratio[1] != 0 ? <TransactionDistributionChart chartData={ratio} /> : <span>No data available</span>}
                    <div className={styles.labels}>
                        {ratio[1] > ratio[0] ?
                            <>
                                <div className={styles.sentLabel}>
                                    <div></div>
                                    Sent {ratio[1]}%
                                </div>
                                <div className={styles.receivedLabel}>
                                    <div></div>
                                    Received {ratio[0]}%
                                </div>
                            </>
                            : <>

                                <div className={styles.receivedLabel}>
                                    <div></div>
                                    Received {ratio[0]}%
                                </div>
                                <div className={styles.sentLabel}>
                                    <div></div>
                                    Sent {ratio[1]}%
                                </div>
                            </>}


                    </div>
                </div>

                <div className={styles.numerics}>
                    <h3>Numerics</h3>

                    {numericsData ?
                        <div>
                            <>
                                <p>Wallet Value<span>${numericsData["walletValue"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                <p>Fungible Token Count<span>{numericsData["fungibleTokenCount"]}</span></p>
                                <p>NFT Count<span>{numericsData["nftCount"]}</span></p>
                                <p>1 $SOL<span>${numericsData["solPrice"]}</span></p>
                            </>
                        </div>
                        : <Loading />}

                </div>

            </main>

        </>
    )
}
