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
  const [publicKey, setPublicKey] = useState<string>();
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const fetchData = async () => {
      const pubKey = await connectWallet(false, false)
      setPublicKey(pubKey)
      const result = await fetch(API_URL + `/bookmark/get/${pubKey}`)
      const data = await result.json()
      if (result.ok) {
        setData(data.bookmarks)
        setTotal(data.total)
      } else {
        const json = await result.json()
        toast.error(json.error)
      }

    }
    setTimeout(() => fetchData(), 500)
  }, []);

  const getBookmark = async (e: any) => {
    e.preventDefault();
    if (rateLimited) {
      return
    }
    if (e.target.search.value == "") {
      if (data.length == 1) {
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
      if (res.status == 429) {
        toast.error("You are being rate limited", { toastId: "to_prevent_duplication" })
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
      <form className={styles.search} onSubmit={(e) => getBookmark(e)}>
        <input type="text" placeholder="Search by username or address" name="search" />
        <button type="submit">
          <Image src={Search} width="25" height="25" alt="search" />
        </button>
      </form>
      <p>Total bookmarks: {total}</p>
      {data ? (data.map((a: any) => (
        <Link key={a['username']} href={a['username']}><a>
          <div className={styles.bookmark}>
            <div className={styles.left}>
              <Image src={a['avatar']} objectFit='cover' height="40px" width="40px" alt="avatar"/>
              <p>{a['username']}</p>
            </div>
            <p className={styles.publicKey}>{a['public_key']}</p>
          </div>
        </a></Link>
      ))
      ) : null
      }
    </div>

  )
}