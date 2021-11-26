import Image from 'next/image'
import styles from '@/styles/modules/ProfileBox.module.scss'
import Copy from '@/images/icons/Copy.svg'
import Sent from '@/images/Sent.svg'
import Received from '@/images/Received.svg'
import Bookmark from '@/images/Bookmark.svg'
import BookmarkActive from '@/images/BookmarkActive.svg'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { connectWallet, signMessage } from '@/components/Wallet'
import { useState, useEffect } from 'react'

export const ProfileBox = ({ user, activity }: any) => {
    const joined = user.joined_on.substring(0, 10)
    const months: any = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    }
    const split = joined.split("-")
    const month = months[split[1]]
    const joined_on = split[2] + " " + month + " " + split[0]

    const [bookmarked, setBookmarked] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
          let public_key = window.solana._publicKey
          if (window.solana._publicKey == null){
              public_key = await connectWallet(false)
          }
          const result = await fetch(`http://localhost:8000/bookmark/check/${public_key.toString()}/${user.public_key}`)
          const data = await result.json()
          setBookmarked(data.bookmarked)
        }
        fetchData()
      }, []);

    const copyAddress  = () => {
        const x = document.querySelector(".pubkey")
        if (x != null && x.textContent != null) {
            navigator.clipboard.writeText(x.textContent)
        }
        toast.success("Copied address to clipboard!")
    }

    const addBookmark = async (e: any) => {
        const signature = await signMessage(e)
        if (signature != undefined) {
            const data = {
                owner_public_key: window.solana._publicKey.toString(),
                signature: signature,
                profile_public_key: user.public_key
            }

            const hmm = bookmarked ? "remove" : "add"
            fetch(`http://localhost:8000/bookmark/${hmm}`, {
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

    }

    return (
        <div className={styles.parent}>
            <div className={styles.profilebox}>

                <div className={styles.uppersection}>
                    <img className={styles.avatar} src={user.avatar} alt="avatar" height="150" />
                    <h1>{user.username}</h1>
                    <img className={styles.banner} src={user.banner} alt="banner" height="200" />
                </div>

                <div className={styles.address}>
                    <p className="pubkey">{user.public_key}</p>
                    <Image className={styles.copy} src={Copy} onClick={copyAddress} alt="copy" height="25" width="25" />
                </div>

                <div className={styles.bio}>
                    <div className={styles.upper}>
                        <h2>Bio</h2>
                        <Image src={bookmarked ? BookmarkActive : Bookmark } onClick={(e) => addBookmark(e)} width="40" height="20"/>
                    </div>
                    <p>{user.bio}</p>
                    <hr />
                </div>
                
                <div className={styles.activity}>
                    <h2>Recent activity</h2>
                    {activity ? (activity.map((a: any) => (
                            <a href={"https://solscan.io/tx/"+a['tx']}>
                                <div className={styles.transaction}>
                                <Image src={(a['type'] == "sent") ? Sent : Received} width="40" /> 
                                <p>{a["message"]}</p>
                                </div>
                            </a>
                            
                            ))
                            )  : <>
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
                <div className={styles.bottom}>
                    <p>Joined on {joined_on}</p>
                </div>

            </div>
        </div>

    )
}

