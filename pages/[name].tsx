import React, { useState, useEffect } from 'react'
import { PageHead } from '@/components/Head'
import { ProfileBox } from '@/components/ProfileBox'
import { Navbar } from '@/components/Navbar'
import { ToastContainer } from 'react-toastify'

export default function Profile( {user}: any ) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`http://localhost:8000/fetch/activity/${user.public_key}`)
      const data = await result.json()
      setActivity(data)
    }
    fetchData()
  }, []);

  return (
    <>
    <PageHead title={'NodeAir - Easier, faster & insightful Solana wallet experience.'} />
    <Navbar/>
    <ToastContainer theme="dark" position= "top-center" autoClose={5000} closeOnClick={true} pauseOnHover={false}/>
    <ProfileBox user={user} activity={activity}/>
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
  