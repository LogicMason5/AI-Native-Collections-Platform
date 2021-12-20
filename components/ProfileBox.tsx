import Image from 'next/image'
import { useState, useEffect } from 'react'
import { connectWallet, signMessage } from '@/components/Wallet'
import { GetMonth } from '@/components/Utils'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sent from '@/images/Sent.svg'
import Received from '@/images/Received.svg'
import Bookmark from '@/images/icons/Bookmark.svg'
import Bookmarked from '@/images/icons/Bookmarked.svg'
import styles from '@/styles/modules/ProfileBox.module.scss'
import Link from 'next/link'

export const ProfileBox = ({ user, activity }: any) => {
    const joined = user.joined_on.substring(0, 10)
    const split = joined.split("-")
    const month = GetMonth(split[1] - 1)
    const joined_on = split[2] + " " + month + " " + split[0]
    const [bookmarked, setBookmarked] = useState(false)

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const fetchData = async () => {
            let public_key = window.solana._publicKey
            if (window.solana._publicKey == null) {
                public_key = await connectWallet(false)
            }
            const result = await fetch(API_URL + `/bookmark/check/${public_key.toString()}/${user.public_key}`)
            const data = await result.json()
            setBookmarked(data.bookmarked)
        }
        fetchData()
    }, [user]);


    const addBookmark = async (e: any) => {
        const signature = await signMessage(e)
        const data = {
            owner_public_key: window.solana._publicKey.toString(),
            signature: signature,
            profile_public_key: user.public_key
        }

        const hmm = bookmarked ? "remove" : "add"
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        fetch(API_URL + `/bookmark/${hmm}`, {
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then(async res => {
                if (res.ok) {
                    const json = await res.json()
                    toast.success(json.message)
                    setBookmarked(!bookmarked)
                } else {
                    const json = await res.json()
                    toast.error(json.error)
                }

            })
    }

    const copyAddress = () => {
        navigator.clipboard.writeText(user.public_key)
        toast.info("Copied address to clipboard")
    }

    return (
        <div className={styles.profileBox}>

            <Image className={styles.banner} src={user.banner} width="100%" height="200" alt="banner" />

            <div className={styles.uppersection}>
                <img className={styles.avatar} src={user.avatar} width="160" height="160" alt="avatar" />
                <div className={styles.name}>
                    <h1>{user.name}</h1>
                    <h3>@{user.username}</h3>
                </div>
                <div className={styles.topmeta}>
                    <button className={styles.pubKey} id="pubKey" onClick={copyAddress}>Copy address</button>
                    <Image
                        className={styles.bookmark}
                        src={bookmarked ? Bookmarked : Bookmark}
                        onClick={(e) => addBookmark(e)}
                        alt="bookmark"
                        height="45"
                        width="45"
                    />
                </div>

            </div>
            <div className={styles.bio}>
                <h2>Bio</h2>
                <p>{user.bio}</p>
                <h4>Joined on {joined_on}</h4>
            </div>
            < hr className={styles.activitySeperator} />
            <div className={styles.activity}>
                <h2>Recent activity</h2>
                <div className={styles.labels}>
                    <p>Amount(SOL)</p>
                    <p>From/To</p>
                </div>
                {activity ? (activity.map((a: any) => (
                    <Link key={a['tx']} href={"https://solscan.io/tx/" + a['tx']}><a>

                        <div className={styles.transaction}>
                            <div className={styles.type}>
                                <Image src={(a['type'] == "sent") ? Sent : Received} width="35" alt="transaction" />
                                {(a['type'] == "sent") ? <p className={styles.sent}>Sent</p> : <p className={styles.received}>Received</p>}
                            </div>
                            <div className={styles.metadata}>
                            <p className={styles.amount}>{a['amount']}</p>
                            <p className={styles.toFrom}>{a['to'] || a['from']}</p>
                            </div>

                        </div>

                        <hr className={styles.transactionSeperator} />
                    </a></Link>

                ))
                ) : <>
                    <div className={styles.transaction}>
                        <p className={styles.placeholderBox}></p>
                    </div>
                    <div className={styles.transaction}>
                        <p className={styles.placeholderBox}></p>
                    </div>
                    <div className={styles.transaction}>
                        <p className={styles.placeholderBox}></p>
                    </div>
                    <div className={styles.transaction}>
                        <p className={styles.placeholderBox}></p>
                    </div>
                </>
                }
            </div>

        </div>

    )
}

export const ProfileBoxNotFound = ({ username }: any) => {
    return (
        <div className={styles.profileBox}>

            <div className={styles.banner_} />

            <div className={styles.uppersection}>
                <div className={styles.avatar_} />
                <div className={styles.name}>
                    <h3>@{username}</h3>
                </div>
            </div>

            <div className={styles.address}>
                <h1>User not found</h1>
                <hr />
            </div>

            <div className={styles.activity}>
                <div className={styles.transaction}>
                    <p className={styles.placeholderBox}></p>
                </div>
                <div className={styles.transaction}>
                    <p className={styles.placeholderBox}></p>
                </div>
                <div className={styles.transaction}>
                    <p className={styles.placeholderBox}></p>
                </div>
                <div className={styles.transaction}>
                    <p className={styles.placeholderBox}></p>
                </div>
            </div>

        </div>

    )
}