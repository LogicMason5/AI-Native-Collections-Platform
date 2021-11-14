import { useState } from 'react';
import styles from '@/styles/modules/NameModal.module.scss';
import { registerWallet, connectWallet } from './Wallet';
import Money from '@/images/icons/Money.svg';
import Image from 'next/image';
import { toast } from 'react-toastify';

export const NameModal = (props: any) => {
    const [name, setName] = useState("")    
    const [value, setValue] = useState("Starter plan - $1/year");
    const items = [
      {label: "Starter plan - $1/year", value: "Starter plan - $1/year"},
      { label: "Pro plan - $5/year", value: "Pro plan - $5/year" },
      { label: "Starter plan - $5", value: "Starter plan - $5" },
      { label: "Pro plan - $15", value: "Pro plan - $15" }
    ];

    const handleclose = () => {
        props.setModalIsOpen(false)
    }

    const registerWallet = async (event: any) => {
        event.preventDefault();
        const API_URL: any = "http://localhost:8000";
      
        const pubKey = await connectWallet();
        let data
        if (pubKey != null) {
          data = {
            public_key: pubKey.toString(),
            name: name
          }
        }
        fetch(`${API_URL}/register`, {
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST"
          })
          .then(res => {
            if(res.ok) {
              toast.success("Profile registered successfully");     
            } else {
              res.json().then(json => toast.error(json.validation_error))
            }
          })
          .catch((err) => console.log(err))
          handleclose()
        }
      
    return (
      <div className={styles.nameModal}>
        <div className={styles.main}>
            <span className={styles.close} onClick={handleclose}>&times;</span>
            <div className={styles.change_plan}>
              <Image src={Money} height="60" width="60"/>
              <h1>{value}</h1>
              <select onChange={e => setValue(e.currentTarget.value)} value={value}>
                {items.map(item => (
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
            <form  className={styles.form} onSubmit={registerWallet}>
              <p>Get started by entering your profile name and clicking that shiny button below. Feel free to change plan above.</p>
              <h1>Enter your profile name</h1>
              <input onChange={e => setName(e.target.value)} placeholder="Name" type="text"></input>
              <button type="submit" disabled={!setName ? true : false}>Create profile</button>
            </form>
        </div>
      </div>
    )
  }
  
  