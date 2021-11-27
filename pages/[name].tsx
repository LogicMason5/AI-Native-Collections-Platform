import React, { useState, useEffect } from 'react'
import { PageHead } from '@/components/Head'
import { ProfileBox } from '@/components/ProfileBox'
import { Sidebar } from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'
import { DiscoverProfiles } from '@/components/DiscoverProfiles'
import { ToastContainer } from 'react-toastify'
import styles from '@/styles/modules/Profile.module.scss'

export default function Profile({ user, activity }: any) {

  return (
    <>
      <PageHead title={'NodeAir - Easier, faster & insightful Solana wallet experience.'} />
      <Navbar />
      <Sidebar />
      <ToastContainer theme="dark" position="top-center" autoClose={5000} closeOnClick={true} pauseOnHover={false} />
      <div className={styles.profile}>
        <ProfileBox user={user} activity={activity} />
        <hr className={styles.seperator} />
        <DiscoverProfiles />
      </div>

    </>
  )
}

export async function getServerSideProps(context: any) {

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const { name } = context.params
  const res = await fetch(API_URL + "/profile/" + name)
  const user = await res.json()

  const res2 = await fetch(API_URL + "/fetch/activity/" + user.public_key)
  const activity = await res2.json()
  return { props: { user, activity} }

}
