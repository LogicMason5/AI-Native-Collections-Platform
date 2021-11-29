import Image from 'next/image'
import Search from '@/images/icons/Search.svg'
import Reload from '@/images/icons/Reload.svg'
import styles from '@/styles/modules/DiscoverProfiles.module.scss'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'

export const DiscoverProfiles = () => {
  const [data, setData] = useState([]);
  const [rateLimited, setRateLimited] = useState<boolean>(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const fetchData = async () => {
      const result = await fetch(API_URL + "/profile/ext/getrandom")
      const data = await result.json()
      setData(data)
    }
    fetchData()
  }, []);

  const getProfiles = async (e: any, reload: boolean = false) => {
    e.preventDefault();
    if (rateLimited) {
      return
    }
    if (e.target.search == undefined  || e.target.search.value == ""){
      if (reload) {
        const result = await fetch(API_URL + `/profile/ext/getrandom`)
        const data = await result.json()
        if (result.status == 429) {
          toast.error("You are being rate limited", {toastId: "to_prevent_duplication"})
          setRateLimited(false)
          setTimeout(
            () => setRateLimited(false), 
            3000
          );
        } else {
          setData(data)
        }
      }
      
    } else {
    const res = await fetch(API_URL + "/profile/ext/find", {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({ username_or_public_key: e.target.search.value })
    })
    const json = await res.json()
    if (res.ok) {
      //@ts-ignore
      setData([json])
    } else {
      toast.error(json.error)
    }
  }
  }

  return (
    <div className={styles.discoverProfiles}>

      <form className={styles.search} onSubmit={(e) => getProfiles(e)}>
        <Image className={styles.reload} src={Reload} width="30" height="30" onClick={(e) => getProfiles(e, true)}/>
        <div className={styles.gap}></div>
        <input type="text" placeholder="Search profiles by username or public key" name="search" />
        <button type="submit">
          <Image src={Search} width="20" height="20" alt="search" />
        </button>
      </form>

      {data ? (data.map((a: any) => (
        <Link key={a['username']} href={a['username']} ><a className={styles.profileBox}>
          <div className={styles.upper}>
              <Image src={a['avatar']} height="50" width="50" />
              <div className={styles.name}>
                <h3>{a['name']}</h3>
                <h4>@{a['username']} </h4>
            </div>
            <p>{a['public_key']}</p>
          </div>
          
          <div className={styles.lower}>
          <p>{a['bio']}</p>
          </div>
        </a></Link>
      ))
      ) : null
      }
    </div>

  )
}

