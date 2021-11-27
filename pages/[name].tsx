import React, { useState, useEffect } from 'react'
import { PageHead } from '@/components/Head'
import { ProfileBox } from '@/components/ProfileBox'
import { Sidebar } from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'
import { DiscoverProfiles } from '@/components/DiscoverProfiles'
import { ToastContainer } from 'react-toastify'
import styles from '@/styles/modules/Profile.module.scss'

export default function Profile( {user}: any ) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`http://localhost:8000/fetch/activity/8kgbAgt8oedfprQ9LWekUh6rbY264Nv75eunHPpkbYGX`)
      const data = await result.json()
      setActivity(data)
    }
    fetchData()
  }, []);

  return (
    <>
    <PageHead title={'NodeAir - Easier, faster & insightful Solana wallet experience.'} />
      <Navbar/>
      <Sidebar/>
      <ToastContainer theme="dark" position= "top-center" autoClose={5000} closeOnClick={true} pauseOnHover={false}/>
    <div className={styles.profile}>  
      <ProfileBox user={user} activity={activity}/>
      <hr className={styles.seperator}/>
      <DiscoverProfiles/>
    </div>

    </>
  )
}

export async function getServerSideProps(context: any) {

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const { name } = context.params
  const res = await fetch(API_URL + "/profile/" + name)
  const user = await res.json()
  return { props: { user } }
}
  