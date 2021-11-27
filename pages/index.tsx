import Image from 'next/image'
import { useState } from 'react'
import { PageHead } from '@/components/Head'
import { Navbar } from '@/components/Navbar'
import { RegisterModal } from '@/components/RegisterModal'
import { ToastContainer } from 'react-toastify'
import Ladder from '@/images/Ladder.svg'
import Curves from '@/images/Curves.svg'
import Dashboard from '@/images/Dashboard.svg'
import styles from '@/styles/modules/Index.module.scss'


export default function Index() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen)
  }

  return (
    <>
      <PageHead title={'NodeAir - Easier, faster & insightful Solana wallet experience.'} />
      <Navbar />
      <ToastContainer theme="dark" position="top-center" autoClose={5000} closeOnClick={true} pauseOnHover={false} />

      <main className={styles.index}>
        <div className={styles.ladderImage}>
          <Image src={Ladder} alt="ladder" />
        </div>
        <div className={styles.left}>
          <h1>Get more out of your Solana wallet.</h1>
          <p>NodeAir lets you create your public wallet profile to find each other easily and get statistics with graphs about your transactions and activity in seconds.</p>
          <button className={styles.button} onClick={toggleModal}>Create your profile</button>
        </div>
        <div className={styles.curves}>
          <Image src={Curves} alt="curves" />
        </div>
        <hr className={styles.centerSeperator} />

        <div className={styles.right}>
          <div className={styles.one}>
            <h2> <p>1</p> Quick and easy</h2>
            <p>Easily get detailed insights about your transactions and profile in minutes.</p>
          </div>
          <div className={styles.two}>
            <h2><p>2</p>Affordable and flexible</h2>
            <p>Enjoy your favourite features with affordable and flexible pricing.</p>
          </div>
          <div className={styles.two}>
            <h2> <p>3</p>Clean and simple UI</h2>
            <p>Get the best experience with beautiful charts and clean dashboard UI.</p>
          </div>
          <div className={styles.dashboardImage}>
            <Image src={Dashboard} width="700" height="400" alt="dashboard" />
          </div>

        </div>
        {modalIsOpen ? <RegisterModal setModalIsOpen={toggleModal} /> : null}
      </main>
    </>
  )
}

