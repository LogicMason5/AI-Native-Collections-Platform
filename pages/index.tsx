import Image from 'next/image';
import { DefaultHead } from '@/components/Head'
import { Navbar } from '@/components/Navbar'
import { registerWallet } from '@/components/Wallet'
import styles from '@/styles/modules/Index.module.scss'
import ProfileImage from '@/images/profileimage.svg';
import GraphImagefrom from '@/images/graphimage.svg';

export default function Index() {  
  return (
    <>
      <DefaultHead title={'NodeAir - Have more than just wallet address.'} />
        <Navbar/>
        <main className={styles.index_body}>
          <h1 className={styles.heading}>Customize your wallet, get detailed insights about your Solana identity.</h1>
          <p className={styles.description}>NodeAir let's you create your public wallet profile to find each other easily and get statistics with graphs about your transactions and activity in seconds. </p>
          <button className={styles.button} onClick={registerWallet}>Create your profile</button>
          <div className={styles.profile_image} ><Image src={ProfileImage}/></div>
          <div className={styles.graph_image} ><Image src={GraphImagefrom} height="400" width="850"/></div>
        </main>
    </>
  )
}
