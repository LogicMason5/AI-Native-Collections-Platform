import { useState, useEffect } from 'react'
import { registerWallet } from '@/components/Wallet'
import { PriceDropdown } from '@/components/PriceDropdown'
import styles from '@/styles/modules/RegisterModal.module.scss'
import Dollar from '@/images/Dollar.svg'
import Invoice from '@/images/Invoice.svg'
import Image from 'next/image'

export const RegisterModal = (props: any) => {


  const [name, setName] = useState<string>("")
  const [amount, setAmount] = useState<number>(0)
  const [selectedPlan, setSelectedPlan] = useState<string>("Basic - $2/year");
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const pricing: any = {
      "Basic - $2/year": 2,
      "Pro - $6/year": 6,
      "Basic - $10": 10,
      "Pro - $15": 15
    }
    setAmount(pricing[selectedPlan])
  }, [selectedPlan])

  const handleclose = () => {
    props.setModalIsOpen(false)
  }

  const checkInput = (input: string) => {
    setErrorMessage('')
    if (input.length > 15) {
      setErrorMessage("Username can't have more than 15 characters")
      setName('')
      return
    }
    if (input.length > 0 && !input.match(/^[a-zA-Z\d-_]+$/)) {
      setErrorMessage("Username can only contain letters, numbers, '_' and '-'")
      setName('')
      return
    }
    setName(input)
  }
  return (
    <div className={styles.nameModal}>
      <div className={styles.main}>
        <span className={styles.close} onClick={handleclose}>&times;</span>
        <div className={styles.changePlan}>
          <Image src={(selectedPlan.endsWith("/year")) ? Dollar : Invoice} width="50" height="50" alt="pricing" />
          <h1>{selectedPlan}</h1>
          <PriceDropdown setSelectedPlan={setSelectedPlan} />
        </div>
        <hr />
        <form className={styles.form} onSubmit={(e) => registerWallet(e, name, amount)}>
          <p>Get started by entering your profile name and clicking that shiny button below. Feel free to change plan above.</p>
          <h1>Enter your profile name</h1>
          <input style={errorMessage ? { border: "1px solid #ff5151" } : {}} onChange={e => checkInput(e.target.value)} placeholder="Name" type="text"></input>
          <button type="submit" disabled={name.length == 0 ? true : false}>Create profile</button>
          <span >{errorMessage}</span>
        </form>
      </div>
    </div>
  )
}

