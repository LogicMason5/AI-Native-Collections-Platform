import { useState, useEffect } from 'react'
import { registerWallet } from '@/components/Wallet'
import { PriceDropdown } from '@/components/PriceDropdown'

import Dollar from '@/images/Dollar.svg'
import Invoice from '@/images/Invoice.svg'
import Image from 'next/image'
import Free from '@/images/icons/Free.svg'
import { toast } from 'react-toastify'

export const UpdateProfile = (props: any) => {


  const [name, setName] = useState<string>("")
  const [amount, setAmount] = useState<number>(0)
  const [selectedPlan, setSelectedPlan] = useState<string>("Free");
  const [errorMessage, setErrorMessage] = useState<string>('');

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
    <div className={styles.updateModal}>
      <div className={styles.main}>
        <span className={styles.close} onClick={handleclose}>&times;</span>
        <form className={styles.form} onSubmit={(e) => registerWallet(e, name, amount)}>
          <p>Get started by entering your profile name and clicking that button below. Feel free to change plan above.</p>
          <h1>Enter Your Profile Name</h1>
          <input style={errorMessage ? { border: "1px solid #ff5151" } : {}} onChange={e => checkInput(e.target.value)} placeholder="Name" type="text"></input>
          <button type="submit" disabled={name.length == 0 ? true : false}>Create profile</button>
          <span className={styles.error}>{errorMessage}</span>
        </form>
      </div>
    </div>
  )
}

