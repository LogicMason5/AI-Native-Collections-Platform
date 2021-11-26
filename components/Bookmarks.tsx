import Image from 'next/image'
import Search from '@/images/Search.svg'
import styles from '@/styles/modules/Bookmarks.module.scss'
import { useEffect, useState  } from 'react'
import { connectWallet } from './Wallet'

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
      console.log(data)
      setData(data)
    }
    fetchData()
  }, []);

    return (
      <div className={styles.bookmarks}>
      <h2>Bookmarks</h2>
      <form className={styles.search}>
        <input type="text" placeholder="Search bookmarks by username or public key" />
        <button type="submit">
          <Image src={Search}/>
        </button>
      </form>

      {data ? (data.map((a: any) => (
                  <a href={"https://solscan.io/tx/"+a['tx']}>
                  <div className={styles.bookmark}>
                    <img src={a['avatar']} width="60" /> 
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

  