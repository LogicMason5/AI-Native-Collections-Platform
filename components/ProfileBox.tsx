import Image from 'next/image'
import { useState, useEffect } from 'react'
import { connectWallet, signMessage } from '@/components/Wallet'
import { UpdateProfile } from '@/components/UpdateProfile'
import { GetMonth } from 'utils/functions'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sent from '@/images/Sent.svg'
import Received from '@/images/Received.svg'
import Bookmark from '@/images/icons/Bookmark.svg'
import Bookmarked from '@/images/icons/Bookmarked.svg'
import Copy from '@/images/icons/Copy.svg'
import styles from '@/styles/modules/ProfileBox.module.scss'
import Link from 'next/link'

export const ProfileBox = ({ user, activity }: any) => {
    const joined = user.joined_on.substring(0, 10)
    const split = joined.split("-")
    const month = GetMonth(split[1] - 1)
    const joined_on = split[2] + " " + month + " " + split[0]
    const [bookmarked, setBookmarked] = useState(false)

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const [pubKey, setPubKey] = useState<string>()
  
    const toggleModal = () => {
      setModalIsOpen(!modalIsOpen)
    }

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const fetchData = async () => {
            const public_key = await connectWallet(false, false)
            setPubKey(public_key)
            const result = await fetch(API_URL + `/bookmark/check/${public_key}/${user.public_key}`)
            const data = await result.json()
            setBookmarked(data.bookmarked)
        }
        setTimeout(() => fetchData(), 500)
    }, [user]);


    const addBookmark = async (e: any) => {
        const signature = await signMessage(e)
        const data = {
            owner_public_key: await connectWallet(false, false),
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
            <img className={styles.banner} src={user.banner} width="100%" height="200" alt="banner" />
            <div className={styles.moveup}>
                <div className={styles.upper}>
                    <img className={styles.avatar} src={user.avatar} width="180" height="180" alt="avatar" />
                    <span className={styles.name}>{user.name}</span>
                    <span className={styles.username}>@{user.username}</span>
                   {/* {pubKey == user.public_key ? <button className={styles.button} onClick={toggleModal}>Update profile</button> : null}  */}
                    <p className={styles.bio}>{user.bio.replace("[name_here]", user.name)}</p>
                </div>
                <div className={styles.buttons}>
                    <div onClick={copyAddress}>
                        <p>{user.public_key.replace(user.public_key.slice(5, 39), "...")}</p>
                        <Image src={Copy} alt="copy" />
                    </div>
                    <Image
                        className={styles.bookmark}
                        src={bookmarked ? Bookmarked : Bookmark}
                        onClick={(e) => addBookmark(e)}
                        alt="bookmark"
                        height="45"
                        width="45"
                    />
                </div>
                <h4>Joined on {joined_on}</h4>

                < hr className={styles.activitySeperator} />
                <div className={styles.activity}>
                    <h2>Recent activity</h2>
                    <div className={styles.labels}>
                        <p>Amount(SOL)</p>
                        <p>From/To</p>
                    </div>
                    {activity && activity.length > 1 ? (activity.map((a: any) => (
                        <Link key={a['tx']} href={"https://solscan.io/tx/" + a['tx']}><a>

                            <div className={styles.transaction}>
                                <div className={styles.type}>
                                    <Image src={(a['type'] == "sent") ? Sent : Received} width="30" height="30" alt="transaction" />
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
                    ) : <p>No SOL transactions yet...</p>
                    }
                </div>

            </div>
            {modalIsOpen ? <UpdateProfile setModalIsOpen={toggleModal} /> : null}
        </div>

    )
}

export const ProfileBoxNotFound = ({ username }: any) => {
    return (
        <div className={styles.profileBox}>
            <div className={styles.banner_} />
            <div className={styles.moveup}>
                <div className={styles.upper}>
                    <div className={styles.avatar_} />
                        <h3>User not found</h3>
                        <h4>@{username}</h4>
                </div>

            </div>

        </div>

    )
}