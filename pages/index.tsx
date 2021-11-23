import Image from 'next/image'
import { useState } from 'react'
import { PageHead } from '@/components/Head'
import { Navbar } from '@/components/Navbar'
import { ToastContainer } from 'react-toastify'
import Dashboard from '@/images/Dashboard.svg'
import styles from '@/styles/modules/Index.module.scss'
import { RegisterModal } from '@/components/RegisterModal'


export default function Index() { 
  const [plan, setPlan] = useState(true)
  const [starter, setStarter] = useState(true)
  const [pro, setPro] = useState(true)
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const togglePlans = () => {
    setStarter(!starter)
    setPlan(!plan)
    setPro(!pro)
  }
    
  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen)
  }

  return (
    <>
      <PageHead title={'NodeAir - Easier, faster & insightful Solana wallet experience.'} />
        <Navbar/>
        <ToastContainer theme="dark" position= "top-center" autoClose={5000} closeOnClick={true} pauseOnHover={false}/>
        
        <main className={styles.index_body}>
          <h1 className={styles.heading}>Get more out of your Solana wallet.</h1>
          <p className={styles.description}>Create your wallet profile to know about each other more. Get visual representation with graphs about your transactions and activity in seconds.</p>
          <button className={styles.button} onClick={toggleModal}>Create your profile</button>
          <div className={styles.insights_image} ><Image src={Dashboard}/></div>

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
            <h2 className={styles.content_heading}>Affordable and flexible</h2>
            <p className={styles.content_desc}>Enjoy your favourite features with affordable and flexible pricing</p>
            <div className={plan ? styles.boxes2 : styles.boxes2_}>
              <div>
                <h3>Starter plan - {starter ? "$1/year" : "$5"}</h3>
                <h3></h3>
                <ul>
                  <li>Create & update profiles.</li>
                  <li>Profile activity chart.</li>
                  <li>Transaction distribution chart.</li>
                  <li>Copy profile from history.</li>
                </ul>
              </div>
              <div>
                <h3>Pro plan - {pro ? "$5/year" : "$15"}</h3>
                <ul>
                  <li>Transaction activity chart.</li>
                  <li>Filter transactions.</li>
                  <li>Bookmark other profiles.</li>
                  <li>View profile history.</li>
                </ul>
              </div>
            </div>
            <button className={styles.payment_button} onClick={togglePlans}>Prefer {plan ? 'one time payment' : 'subscription based'} plan instead?</button>
          </section>

          <section className={styles.get_started}>
            <h2>What are you waiting for?</h2>
            <p>Get started for free in seconds.</p>
            <button className={styles.button} onClick={toggleModal}>Get started now</button>
          </section>
          {modalIsOpen ? <RegisterModal setModalIsOpen={toggleModal} /> : null}
        </main>
    </>
  )
}

