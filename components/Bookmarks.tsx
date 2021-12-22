import Image from 'next/image'
import Search from '@/images/icons/Search.svg'
import styles from '@/styles/modules/Bookmarks.module.scss'
import { useEffect, useState } from 'react'
import { connectWallet } from './Wallet'
import { toast } from 'react-toastify'
import Link from 'next/link'

export const Bookmarks = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const [rateLimited, setRateLimited] = useState<boolean>(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const fetchData = async () => {
      const publicKey = await connectWallet(false)
      const result = await fetch(API_URL + `/bookmark/get/${publicKey.toString()}`)
      const data = await result.json()
      if (result.ok) {
        setData(data.bookmarks)
        setTotal(data.total)
      } else {
        const json = await result.json()
        toast.error(json.error)
      }
      
    }
    fetchData()
  }, []);

  const getBookmark = async (e: any) => {
    e.preventDefault();
    if (rateLimited) {
      return
    }
    const publicKey = window.solana._publicKey.toString()
    if (e.target.search.value == ""){
      if (data.length == 1){
        const result = await fetch(API_URL + `/bookmark/get/${publicKey}`)
        const data = await result.json()
        setData(data.bookmarks)
      }
      return
    } else {
      const res = await fetch(API_URL + "/bookmark/find", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ public_key: publicKey, username_or_public_key: e.target.search.value })
      })
      if (res.status == 429){
        toast.error("You are being rate limited", {toastId: "to_prevent_duplication"})
        setRateLimited(true)
        setTimeout(
          () => setRateLimited(false), 
          3000
        );
        return
      } else {
        const json = await res.json()
        if (res.ok) {
          //@ts-ignore
          setData([json])
        } else {
          toast.error(json.error)
        }
      }

    }

  }

  return (
    <div className={styles.bookmarks}>
      <div className={styles.upper}>
      <form className={styles.search} onSubmit={(e) => getBookmark(e)}>
        <input type="text" placeholder="Search by username or public key" name="search" />
        <button type="submit">
          <Image src={Search} width="25" height="25" alt="search" />
        </button>
      </form>
      </div>

      {data ? (data.map((a: any) => (
        
        <Link key={a['username']} href={a['username']}><a>
          <div className={styles.bookmark}>
            <div className={styles.left}>
            <img src={a['avatar']} />
            <h3>{a['username']}</h3>
            </div>
            <p>{a['public_key']}</p>
          </div>
        </a></Link>
      ))
      ) : null
      }
      <div className={styles.metaData}>
      <p>Showing the latest {data.length} bookmarks</p>
      <p>Total bookmarks: {total}</p>
      </div>

    </div>

  )
}