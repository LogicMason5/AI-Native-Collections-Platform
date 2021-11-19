import React, { useState, useEffect } from 'react'
import { PageHead } from '@/components/Head'
import { ProfileBox } from '@/components/ProfileBox'


export default function Profile( {user}: any ) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(API_URL + "/profile/activity/" + user["name"])
      const data = await result.json()
      setActivity(data)
    }
    fetchData()
  }, []);

  return (
    <>
    <PageHead title={'NodeAir - Easier, faster & insightful Solana wallet experience.'} />
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
  