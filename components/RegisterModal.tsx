import { useState, useEffect } from 'react'
import { registerWallet } from '@/components/Wallet'
import { PriceDropdown } from '@/components/PriceDropdown'
import styles from '@/styles/modules/RegisterModal.module.scss'
import Dollar from '@/images/icons/Dollar.svg'
import Invoice from '@/images/icons/Invoice.svg'
import Image from 'next/image'
import Free from '@/images/icons/Free.svg'

export const RegisterModal = (props: any) => {


  const [name, setName] = useState<string>("")
  const [amount, setAmount] = useState<number>(0)
  const [selectedPlan, setSelectedPlan] = useState<string>("Free");
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const pricing: any = {
      "Free": 0,
      "Basic - $2/Year": 2,
      "Pro - $6/Year": 6,
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
      return
    }
    if (input.length > 0 && !input.match(/^[a-zA-Z\d-_]+$/)) {
      setErrorMessage("Username can only contain letters, numbers, '_' and '-'")
      return
    }
    setName(input)
  }
  return (
    <div className={styles.nameModal}>
      <div className={styles.main}>
        <span className={styles.close} onClick={handleclose}>&times;</span>
        <div className={styles.changePlan}>
          <div className={styles.currentPlan}>
            <Image src={([2, 6].includes(amount)) ? Dollar : (amount != 0) ? Invoice : Free} width="30" height="30" alt="pricing" />
            <h1>{selectedPlan}</h1>
          </div>
          <PriceDropdown setSelectedPlan={setSelectedPlan} />
        </div>
        <hr />
        <form className={styles.form} onSubmit={(e) => registerWallet(e, name, amount)}>
          <p>Get started by entering your profile name and clicking that button below. Feel free to change plan above.</p>
          <h1>Enter your profile username</h1>
          <input style={errorMessage ? { border: "1px solid #ff5151" } : {}} onChange={e => checkInput(e.target.value)} placeholder="Name" type="text"></input>
          <button type="submit" disabled={name.length == 0 ? true : false}>Create profile</button>
          <span className={styles.error}>{errorMessage}</span>
        </form>
      </div>
    </div>
  )
}

