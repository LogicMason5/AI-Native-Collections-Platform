import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { PageHead } from '@/components/Head'
import { Sidebar } from '@/components/Sidebar'
import { connectWallet } from '@/components/Wallet'
import { NFT } from '@/components/NFT'
import styles from '@/styles/pages/NFTGallery.module.scss'


export default function Dashboard() {
    const [data, setData] = useState<any>()

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const fetchData = async () => {
            const publicKey = await connectWallet(false, false)
            const result = await fetch(API_URL + "/fetch/nfts/" + publicKey)
            if (result.ok) {
                const data = await result.json()
                setData(data)
                console.log(data)
            } else {
                const json = await result.json()
                toast.error(json.error)
            }
        }
        setTimeout(() => fetchData(), 500)
    }, []);

    return (
        <>
            <PageHead title={'NodeAir | NFT Gallery'} />
            <Sidebar />
            <h1 className={styles.note}>NFT Gallery is not available on this screen size at the moment.</h1>

            <main className={styles.nfts}>
                <h1 className={styles.heading} >NFT Gallery</h1>
                <div className={styles.nftsHolder}>

                    {data ? (data.map((a: any) => (
                        <NFT data={a} />
                    ))
                    ) : <h1>Loading</h1>
                    }

                </div>

            </main>

        </>
    )
}
