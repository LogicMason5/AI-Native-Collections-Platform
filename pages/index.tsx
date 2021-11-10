import Image from 'next/image';
import { DefaultHead } from '@/components/Head'
import { Navbar } from '@/components/Navbar'
import { registerWallet } from '@/components/Wallet'
import styles from '@/styles/modules/Index.module.scss'
import InsightsImage from '@/images/InsightsImage.png';

export default function Index() {  
  return (
    <>
      <DefaultHead title={'NodeAir - Have more than just wallet address.'} />
        <Navbar/>
        <main className={styles.index_body}>
          <h1 className={styles.heading}>Get more out of your Solana wallet.</h1>
          <p className={styles.description}>NodeAir let's you create your public wallet profile to find each other easily and get statistics with graphs about your transactions and activity in seconds. </p>
          <button className={styles.button} onClick={registerWallet}>Create your profile</button>
          <div className={styles.insightsImage} ><Image src={InsightsImage}/></div>
          <div className={styles.features}>
            <h2 className={styles.content_heading}>Features you want</h2>
            <p className={styles.content_desc}>Easy to use, quick and useful features.</p>
          </div>
        </main>
    </>
  )
}
