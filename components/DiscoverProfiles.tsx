import Image from 'next/image'
import Search from '@/images/Search.svg'
import styles from '@/styles/modules/DiscoverProfiles.module.scss'
import { useEffect, useState  } from 'react'
import { toast } from 'react-toastify'

export const DiscoverProfiles = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`http://localhost:8000/profile/ext/getrandom`)
      const data = await result.json()
      setData(data)
    }
    fetchData()
  }, []);

    const getProfile = async (e: any) => {
      e.preventDefault();
      const res = await fetch("http://localhost:8000/profile/ext/find", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({username_or_public_key: e.target.search.value})
      })
      const json = await res.json()
      if (res.ok) {
        //@ts-ignore
        setData([json])
        console.log(json)
      } else {
        toast.error(json.error)
      }
    }

    return (
      <div className={styles.discoverProfiles}>
        <h2>Discover</h2>
        <form className={styles.search}  onSubmit={(e) => getProfile(e)}>
          <input type="text" placeholder="Search profiles by username or public key" name="search"/>
          <button type="submit">
            <Image src={Search} width="60"/>
          </button>
        </form>

        {data ? (data.map((a: any) => (
                <a href={a['username']}className={styles.profileBox}>
                  <div className={styles.upper}>
                      <img src={a['avatar']} /> 
                      <div className={styles.name}>
                        <h3>{a['name']}</h3>
                        <h4>@{a['username']} </h4>
                      </div>
                      <p>{a['public_key']}</p>
                  </div>
                    <p>{a['bio']}</p>
                </a>
                      ))
                      )  : null
                          }
      </div>
              
  )
}

  