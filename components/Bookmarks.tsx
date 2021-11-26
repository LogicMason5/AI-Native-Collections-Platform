import Image from 'next/image'
import Search from '@/images/Search.svg'
import styles from '@/styles/modules/Bookmarks.module.scss'
import { useEffect, useState  } from 'react'
import { connectWallet } from './Wallet'
import { toast } from 'react-toastify'

export const Bookmarks = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let public_key = window.solana._publicKey
      if (window.solana._publicKey == null){
          public_key = await connectWallet(false)
      }
      const result = await fetch(`http://localhost:8000/bookmark/get/${public_key.toString()}`)
      const data = await result.json()
      setData(data)
    }
    fetchData()
  }, []);

    const getBookmark = async (e: any) => {
      e.preventDefault();
      const res = await fetch("http://localhost:8000/bookmark/find", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({public_key: window.solana._publicKey.toString(), username_or_public_key: e.target.search.value})
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
      <form className={styles.search}  onSubmit={(e) => getBookmark(e)}>
        <input type="text" placeholder="Search bookmarks by username or public key" name="search"/>
        <button type="submit">
          <Image src={Search} width="60"/>
        </button>
      </form>

      {data ? (data.map((a: any) => (
                  <a href={a['username']}>
                  <div className={styles.bookmark}>
                    <img src={a['avatar']} /> 
                    <h3>{a['username']}</h3>
                    <p>{a['public_key']}</p>
                  </div>
                </a>
                    ))
                    )  : null
                        }
      </div>
              
  )
}

  