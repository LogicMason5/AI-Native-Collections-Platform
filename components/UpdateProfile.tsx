import { useState } from 'react'
import styles from '@/styles/modules/UpdateProfile.module.scss'

export const UpdateProfile = (props: any) => {

  const [name, setName] = useState<string>("")
  const [bio, setBio] = useState<number>(0)
  const [social, setSocial] = useState<string>("Free");
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

  const updateProfile = (e: any) => {
    e.preventDefault()
    setErrorMessage('')
  }
  return (
    <div className={styles.updateModal}>
      <div className={styles.main}>
        <span className={styles.close} onClick={handleclose}>&times;</span>
        <form className={styles.form} onSubmit={(e) => updateProfile(e)}>
          <input style={errorMessage ? { border: "1px solid #ff5151" } : {}} onChange={e => checkInput(e.target.value)} placeholder="Name" type="text"></input>
          <input style={errorMessage ? { border: "1px solid #ff5151" } : {}} onChange={e => checkInput(e.target.value)} placeholder="Bio" type="text"></input>
          <input style={errorMessage ? { border: "1px solid #ff5151" } : {}} onChange={e => checkInput(e.target.value)} placeholder="Social" type="text"></input>
          <button type="submit" >Update</button>
          <span className={styles.error}>{errorMessage}</span>
        </form>
      </div>
    </div>
  )
}

