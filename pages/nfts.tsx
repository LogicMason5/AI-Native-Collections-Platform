import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { PageHead } from '@/components/Head'
import { Sidebar } from '@/components/Sidebar'
import { StageSpinner } from 'react-spinners-kit'
import { NFT } from '@/components/NFT'
import styles from '@/styles/pages/NFTGallery.module.scss'
import { connectWallet } from '@/components/Wallet'


export default function Dashboard() {
    const [data, setData] = useState<any>()

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const fetchData = async () => {
            const localStorageData = localStorage.getItem("nfts")
            if (!localStorageData){
                const publicKey = await connectWallet(false, false)
                const result = await fetch(API_URL + "/fetch/nfts/" + publicKey + "?limit=50&offset=0")
                if (result.ok) {
                    const data = await result.json()
                    setData(data)
                    localStorage.setItem("nfts", JSON.stringify(data))
                } else {
                    const json = await result.json()
                    toast.error(json.error + "\nTry again after sometime")
                }
            } else {
                setData(JSON.parse(localStorageData))
            }
            }
        window.solana ? fetchData() : setTimeout(() => fetchData(), 500)
    }, []);

    return (
        <>
            <PageHead title={'NodeAir | NFT Gallery'} />
            <Sidebar />
            <h1 className={styles.note}>NFT Gallery is not available on this screen size at the moment.</h1>

            <main className={styles.nfts}>
                <h1 className={styles.heading} >NFT Gallery</h1>
                <div className={styles.nftsHolder}>

                    {data ? data.length > 0 ? (data.map((a: any) => (
                        <NFT data={a} />
                    ))
                    ) : <div className={styles.loading}><h2>No NFTs available</h2></div> : <div className={styles.loading}><StageSpinner size={100} color="#869ACE"/></div> 
                    }

                </div>
            </main> 

        </>
    )
}
