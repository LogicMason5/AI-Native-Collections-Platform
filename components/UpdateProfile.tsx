import { useState } from 'react'
import Image from "next/image"
import EditBanner from '@/images/icons/EditBanner.svg'

import styles from '@/styles/modules/UpdateProfile.module.scss'

export const UpdateProfile = (props: any) => {

  const [name, setName] = useState<string>("")
  const [bio, setBio] = useState<number>(0)
  const [social, setSocial] = useState<string>("Free");
  const [avatar, setAvatar] = useState<string>('')
  const [banner, setBanner] = useState<string>('')
  const [avatarFile, setAvatarFile] = useState<any>(null)
  const [bannerFile, setBannerFile] = useState<any>(null)

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
        <div className={styles.upper}>
          <h3>Update profile</h3>
          <span className={styles.close} onClick={handleclose}>&times;</span>
        </div>

        <form className={styles.form} onSubmit={(e) => updateProfile(e)}>
          <div className={styles.bannerParent}>
          <Image alt="banner" src={banner || props.userData.banner} objectFit='cover' height="130px" width="100%"/>
            <input className={styles.bannerInput}  onChange={(e) => {
              setBannerFile(e.target.files ? e.target.files[0] : null) 
              setBanner(e.target.files ? URL.createObjectURL(e.target.files[0]): '')
            }}
              id="banner-input" type="file" />

            <label className={styles.editBanner}  htmlFor="banner-input">
              <Image alt="edit banner" src={EditBanner} height="30" width="30"/>
            </label>
          </div>



          <div className={styles.textfields}>
            <input style={errorMessage ? { border: "1px solid #ff5151" } : {}} onChange={e => checkInput(e.target.value)} placeholder="Name" type="text"></input>
            <input style={errorMessage ? { border: "1px solid #ff5151" } : {}} onChange={e => checkInput(e.target.value)} placeholder="Bio" type="text"></input>
            <input style={errorMessage ? { border: "1px solid #ff5151" } : {}} onChange={e => checkInput(e.target.value)} placeholder="Social" type="text"></input>
            <button type="submit" >Update</button>
          </div>

          <span className={styles.error}>{errorMessage}</span>
        </form>
      </div>
    </div>
  )
}

