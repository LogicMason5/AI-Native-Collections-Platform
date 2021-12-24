import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { PageHead } from '@/components/Head'
import { Navbar } from '@/components/Navbar'
import { RegisterModal } from '@/components/RegisterModal'
import { connectWallet } from '@/components/Wallet'
import Ladder from '@/images/Ladder.svg'
import Curves from '@/images/Curves.svg'
import Dashboard from '@/images/Dashboard.svg'
import styles from '@/styles/pages/Index.module.scss'



export default function Index() {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false)
  const [checkUserOnConnect, setCheckUserOnConnect] = useState<boolean>(false)

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen)
  }

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const check = async () => {
      const publicKey = await connectWallet(false, true)
      if (publicKey) {
        const res = await fetch(API_URL + "/checks/user/" + publicKey)
        if (res.ok) {
          setIsRegistered(true)
        }
      }
    }
    setTimeout(() => check(), 1000)
  }, [checkUserOnConnect])


  return (
    <>
      <PageHead />
      <Navbar isRegistered={isRegistered} setCheckUserOnConnect={setCheckUserOnConnect}/>

      <main className={styles.index}>
        <div className={styles.ladderImage}>
          <Image src={Ladder} alt="ladder" />
        </div>

        <div className={styles.left}>
          <h1>Get more out of your Solana wallet.</h1>
          <p>NodeAir lets you create your public wallet profile to find each other easily and get statistics with graphs about your transactions and activity in seconds.</p>
          {isRegistered ?
            <Link href="/dashboard"><a className={styles.button} >Go to dashboard </a></Link>
            : <button className={styles.button} onClick={toggleModal}>Create profile</button>
          }
        </div>

        <div className={styles.curves}>
          <Image src={Curves} alt="curves" />
        </div>

        <hr className={styles.centerSeperator} />

        <div className={styles.right}>
          <div>
            <h2> <p>1</p> Quick and easy</h2>
            <p>Easily get detailed insights about your transactions and profile in minutes.</p>
          </div>
          <div>
            <h2><p>2</p>Affordable and flexible</h2>
            <p>Enjoy your favourite features with affordable and flexible pricing.</p>
          </div>
          <div>
            <h2><p>3</p>Clean and simple UI</h2>
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

