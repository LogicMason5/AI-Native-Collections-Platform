import Image from 'next/image'
import Search from '@/images/Search.svg'
import styles from '@/styles/modules/Bookmarks.module.scss'
import { useEffect, useState } from 'react'
import { connectWallet } from './Wallet'
import { toast } from 'react-toastify'
import Link from 'next/link'

export const Bookmarks = () => {
  const [data, setData] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const fetchData = async () => {
      let public_key = window.solana._publicKey
      if (window.solana._publicKey == null) {
        public_key = await connectWallet(false)
      }
      const result = await fetch(API_URL + `/bookmark/get/${public_key.toString()}`)
      const data = await result.json()
      setData(data)
    }
    fetchData()
  }, []);

  const getBookmark = async (e: any) => {
    e.preventDefault();
    const res = await fetch(API_URL + "/bookmark/find", {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({ public_key: window.solana._publicKey.toString(), username_or_public_key: e.target.search.value })
    })
    const json = await res.json()
    if (res.ok) {
      //@ts-ignore
      setData([json])
    } else {
      toast.error(json.error)
    }
  }

  return (
    <div className={styles.bookmarks}>
      <h2>Bookmarks</h2>
      <form className={styles.search} onSubmit={(e) => getBookmark(e)}>
        <input type="text" placeholder="Search by username or public key" name="search" />
        <button type="submit">
          <Image src={Search} width="60" alt="search" />
        </button>
      </form>
      <p>Showing the latest {data.length} bookmarks</p>
      {data ? (data.map((a: any) => (
        
        <Link key={a['username']} href={a['username']}><a>
          <div className={styles.bookmark}>
            <img src={a['avatar']} />
            <h3>{a['username']}</h3>
            <p>{a['public_key']}</p>
          </div>
        </a></Link>
      ))
      ) : null
      }
    </div>

  )
}