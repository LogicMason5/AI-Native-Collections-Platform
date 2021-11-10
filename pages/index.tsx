import Image from 'next/image';
import { DefaultHead } from '@/components/Head'
import { Navbar } from '@/components/Navbar'
import { registerWallet } from '@/components/Wallet'
import styles from '@/styles/modules/Index.module.scss'
import InsightsImage from '@/images/InsightsImage.svg';
import { ToastContainer } from 'react-toastify';

export default function Index() {  
  return (
    <>
      <DefaultHead title={'NodeAir - Have more than just wallet address.'} />
        <Navbar/>
        <ToastContainer/>
        <main className={styles.index_body}>
          <h1 className={styles.heading}>Get more out of your Solana wallet.</h1>
          <p className={styles.description}>NodeAir let's you create your public wallet profile to find each other easily and get statistics with graphs about your transactions and activity in seconds. </p>
          <button className={styles.button} onClick={registerWallet}>Create your profile</button>
          <div className={styles.insights_image} ><Image src={InsightsImage}/></div>
          <section className={styles.features}>
            <h2 className={styles.content_heading}>Features you want</h2>
            <p className={styles.content_desc}>Easy to use, quick and useful features.</p>
            <div className={styles.boxes1}>
              <div>
                <h3>Custom profile</h3>
                <p>Create your profile in seconds, show it to anyone with a shareable link.</p>
              </div>
              <div >
                <h3>Insights</h3>
                <p>Get your profile activity and transaction history in the form of graphs.</p>
              </div>
              <div >
                <h3>Open source</h3>
                <p>For developers, the entire codebase is available on GitHub.</p>
              </div>
              <div>
                <h3>Profile history</h3>
                <p>Want to know what change you made in your profile or revert it back? Done. </p>
              </div>
            </div>
          </section>

          <section className={styles.pricing}>
            <h2 className={styles.content_heading}>Affordable and easy</h2>
            <p className={styles.content_desc}>Easy to use, quick and useful features.</p>
            <div className={styles.boxes2}>
              <div>
                <h3>Free plan - $0</h3>
                <ul>
                  <li>Create & update profiles.</li>
                  <li>Profile activity chart.</li>
                  <li>Transaction distribution chart.</li>
                  <li>Copy profile from history.</li>
                </ul>
              </div>
              <div>
                <h3>Pro plan - $5/year</h3>
                <ul>
                  <li>Transaction activity chart.</li>
                  <li>Filter transactions.</li>
                  <li>Bookmark other profiles.</li>
                  <li>View profile history.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className={styles.get_started}>
            <h2>What are you waiting for?</h2>
            <p>Get started for free in seconds.</p>
            <button className={styles.button} onClick={registerWallet}>Get started now</button>
          </section>
        </main>
    </>
  )
}
