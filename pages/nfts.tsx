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
    const [offset, setOffset] = useState<number>(0)
    const [showPlaceHolder, setShowPlaceHolder] = useState<boolean>(false)

    useEffect(() => {
        console.log(offset)
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const fetchData = async () => {
                const publicKey = "2FeNp2PiN7iZCGPQWMG8wTKn27roQxxMbkyC463iM3KG"
                const result = await fetch(API_URL + "/fetch/nfts/" + publicKey + "?limit=4&offset=" + offset)
                if (result.ok) {
                    const res_data = await result.json()
                    setShowPlaceHolder(true)
                    if (offset == 0) {
                        setData(res_data)
                    } else {
                        let array = data
                        array.push(...res_data)
                        setData(array)
                    }
                    if (res_data.length != 0) {
                        setOffset(offset + 4)
                    } else {
                        setShowPlaceHolder(false)
                    }
                } else {
                    const json = await result.json()
                    toast.error(json.error + "\nTry again after sometime")
                }
            }
        window.solana ? fetchData() : setTimeout(() => fetchData(), 500)
    }, [offset]);

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
                    {showPlaceHolder ? <><NFT data={1}/><NFT data={1}/><NFT data={1}/><NFT data={1}/></> : null} 
                </div>
            </main> 

        </>
    )
}
