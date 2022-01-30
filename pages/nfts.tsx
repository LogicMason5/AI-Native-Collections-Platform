import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { PageHead } from '@/components/Head'
import { Sidebar } from '@/components/Sidebar'
import { StageSpinner } from 'react-spinners-kit'
import { NFT } from '@/components/NFT'
import styles from '@/styles/pages/NFTGallery.module.scss'
import { connectWallet } from '@/components/Wallet'
import Image from 'next/image'
import Search from '@/images/icons/Search.svg'

export default function Dashboard() {
    const [publicKey, setPublicKey] = useState<string>()
    const [data, setData] = useState<any>()
    const [offset, setOffset] = useState<number>(0)
    const [showPlaceHolder, setShowPlaceHolder] = useState<boolean>(false)

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const fetchData = async () => {
            const localStorageNfts = localStorage.getItem("nfts")
            if (localStorageNfts) {
                setData(JSON.parse(localStorageNfts))
                setOffset(localStorageNfts.length)
            }
            const pubKey = publicKey ? publicKey : await connectWallet(false, false)
            const result = await fetch(API_URL + "/fetch/nfts/" + pubKey + "?limit=16&offset=" + offset)
            if (result.ok) {
                const res_data = await result.json()
                setShowPlaceHolder(true)
                if (offset == 0) {
                    setData(res_data)
                } else {
		    console.log(showPlaceHolder)
                    let array = data
                    array.push(...res_data)
                    setData(array)
		    if (!publicKey){
		      localStorage.removeItem("nfts")
		      localStorage.setItem("nfts", JSON.stringify(array))

		    }
                }
                if (res_data.length != 0) {
                    setOffset(offset + 16)
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

    const updatePublicKey = async (e: any) => {
        e.preventDefault();
        setPublicKey(e.target.search.value)
	setOffset(0)
	setData()
	localStorage.removeItem("nfts")
      }
    return (
        <>
            <PageHead title={'NodeAir | NFT Gallery'} />
            <Sidebar />
            <h1 className={styles.note}>NFT Gallery is not available on this screen size at the moment.</h1>

            <main className={styles.nfts}>
                <h1 className={styles.heading} >NFT Gallery</h1>
            <form className={styles.search} onSubmit={(e) => updatePublicKey(e)}>
                <div className={styles.gap}></div>
                <Image src={Search} width="40" height="40" alt="search" />
                <input type="text" placeholder="View NFTs by username or public key" name="search" />
                <button type="submit">
                </button>
            </form>
                <div className={styles.nftsHolder}>

                    {data ? data.length > 0 ? (data.map((a: any) => (
                        <NFT key={a} data={a} />
                    ))
                    ) : <div className={styles.loading}><h2>No NFTs available</h2></div> : <div className={styles.loading}><StageSpinner size={100} color="#869ACE" /></div>
                    }
                    {showPlaceHolder ? <><NFT data={1} /><NFT data={1} /><NFT data={1} /><NFT data={1} /></> : null}
                </div>
            </main>

        </>
    )
}
