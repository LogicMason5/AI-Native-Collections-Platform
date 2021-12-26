import { toast } from 'react-toastify'
import { PageHead } from '@/components/Head'
import { ProfileBox, ProfileBoxNotFound } from '@/components/ProfileBox'
import { Sidebar } from '@/components/Sidebar'
import { DiscoverProfiles } from '@/components/DiscoverProfiles'
import styles from '@/styles/pages/Profile.module.scss'
import { useEffect } from 'react'

export default function Profile({ userData, name }: any) {

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const updateCount = async () => {
        const result = await fetch(API_URL + "/profile/update_count/" + name)
        if (!result.ok) {
          const json = await result.json()
          console.log("Error update view count: ", json)
        }
    }
    updateCount()
  }, []);

  return (
    <>
      <PageHead title={'NodeAir | @' + name} />
      <Sidebar />
      <h1 className={styles.note}>Profile/Discovery is not available on this screen size at the moment.</h1>

      <main className={styles.profile}>
        <h1 className={styles.heading}>Discover</h1>
        <div className={styles.profileBox}>
            {userData ? <ProfileBox user={userData.user} activity={userData.recent_activity} /> : <ProfileBoxNotFound username={name} />}
        </div>
        <hr className={styles.seperator} />
        <div className={styles.discover}>
          <DiscoverProfiles />
        </div>

      </main>

    </>
  )
}

export async function getServerSideProps(context: any) {

  const name = context.params.name
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(API_URL + "/profile/" + name)
  let userData = null
  if (res.ok) {
    userData = await res.json()
  } else {
    const json = await res.json()
    toast.error(json.error)
  }

  return { props: { userData, name } }

}
