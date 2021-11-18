import Image from 'next/image';
import { registerWallet } from './Wallet';
import { useState, useEffect } from 'react';
import Money from '@/images/icons/Money.svg';
import styles from '@/styles/modules/RegisterModal.module.scss';


export const RegisterModal = (props: any) => { 
    const pricing: any = {
                        "Starter plan - $1/year": 1, 
                        "Pro plan - $5/year": 5,
                        "Starter plan - $5": 5,
                        "Pro plan - $15": 15
                      }
    const itemLabels = [
      { label: "Starter plan - $1/year", value: "Starter plan - $1/year"},
      { label: "Pro plan - $5/year", value: "Pro plan - $5/year" },
      { label: "Starter plan - $5", value: "Starter plan - $5" },
      { label: "Pro plan - $15", value: "Pro plan - $15" }
    ];

    const [name, setName] = useState<string>("")   
    const [selectedPlan, setSelectedPlan] = useState<string>("Starter plan - $1/year");
    let amount = 0
    useEffect(() => {amount = pricing[selectedPlan] });

    const handleclose = () => {
        props.setModalIsOpen(false)
    }

    return (
      <div className={styles.nameModal}>
        <div className={styles.main}>
            <span className={styles.close} onClick={handleclose}>&times;</span>
            <div className={styles.change_plan}>
              <Image src={Money} height="60" width="60"/>
              <h1>{selectedPlan}</h1>
              <select onChange={e => setSelectedPlan(e.currentTarget.value)} value={selectedPlan}>
                {itemLabels.map(item => (
                  <option
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
  
  