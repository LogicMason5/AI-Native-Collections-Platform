import { useRouter } from "next/router"
import { PageHead } from '@/components/Head'
import { ProfileBox, ProfileBoxNotFound } from '@/components/ProfileBox'
import { Sidebar } from '@/components/Sidebar'
import { DiscoverProfiles } from '@/components/DiscoverProfiles'
import { ToastContainer } from 'react-toastify'
import styles from '@/styles/modules/Profile.module.scss'

export default function Profile({ user, activity }: any) {
  const router = useRouter()
  if (user == "User not found") {
    return (
      <>
      <PageHead title={'NodeAir - Easier, faster & insightful Solana wallet experience.'} />
      <Sidebar />

      <h1 className={styles.note}>Dashboard is not available on this screen size at the moment.</h1>
      <div className={styles.profile}>

        <h1 className={styles.heading}>Discover</h1>
        <div className={styles.profileBox}>
          <ProfileBoxNotFound username={router.asPath.split("/")[1]}/>
        </div>
        <div className={styles.discover}>
          <DiscoverProfiles />
        </div>

      </div>
      </>
    )
  }
  return (
    <>
      <PageHead title={'NodeAir - Easier, faster & insightful Solana wallet experience.'} />
      <Sidebar />
      
      <ToastContainer theme="dark" position="top-center" autoClose={5000} closeOnClick={true} pauseOnHover={false} />
      <h1 className={styles.note}>Dashboard is not available on this screen size at the moment.</h1>
      <div className={styles.profile}>

        <h1 className={styles.heading}>Discover</h1>
        <div className={styles.profileBox}>
          <ProfileBox user={user} activity={activity} />
        </div>
        <div className={styles.discover}>
          <DiscoverProfiles />
        </div>

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
  return { props: { user, activity } }

}
