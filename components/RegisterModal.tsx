import Image from 'next/image'
import { useState, useEffect } from 'react'
import { registerWallet } from './Wallet'
import Money from '@/images/icons/Money.svg'
import styles from '@/styles/modules/RegisterModal.module.scss'


export const RegisterModal = (props: any) => { 
    const pricing: any = {
                        "Basic - $1/year": 1, 
                        "Pro - $5/year": 5,
                        "Basic - $5/forever": 5,
                        "Pro - $15/forever": 15
                      }
    const itemLabels = [
      { label: "Basic - $1/year", value: "Basic - $1/year"},
      { label: "Pro - $5/year", value: "Pro - $5/year" },
      { label: "Basic - $5/forever", value: "Basic - $5/forever" },
      { label: "Pro - $15/forever", value: "Pro - $15/forever" }
    ]

    const [name, setName] = useState<string>("")   
    const [selectedPlan, setSelectedPlan] = useState<string>("Starter - $1/year");
    let amount = 0
    useEffect(() => {amount = pricing[selectedPlan] })

    const handleclose = () => {
        props.setModalIsOpen(false)
    }

    return (
      <div className={styles.nameModal}>
        <div className={styles.main}>
            <span className={styles.close} onClick={handleclose}>&times;</span>
            <div className={styles.change_plan}>
              <Image className={styles.img} src={Money} height="50" width="50"/>
              <h1>{selectedPlan}</h1>
              <select onChange={e => setSelectedPlan(e.currentTarget.value)} value={selectedPlan}>
                {itemLabels.map(item => (
                  <option className={item.value.endsWith("forever") ? styles.forever : styles.subs}
                    key={item.value}
                    value={item.value}
                  >
                {item.label}
                  </option>
                ))}
               </select>
            </div>
            <hr />
            <form  className={styles.form} onSubmit={(e) => registerWallet(e, name, amount)}>
              <p>Get started by entering your profile name and clicking that shiny button below. Feel free to change plan above.</p>
              <h1>Enter your profile name</h1>
              <input onChange={e => setName(e.target.value)} placeholder="Name" type="text"></input>
              <button type="submit" disabled={!name ? true : false}>Create profile</button>
            </form>
        </div>
      </div>
    )
  }
  
  