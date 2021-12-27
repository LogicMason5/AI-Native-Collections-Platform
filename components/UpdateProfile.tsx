import { useState } from 'react'
import Image from "next/image"
import { useRouter } from 'next/router';
import EditBanner from '@/images/icons/EditBanner.svg'
import EditAvatar from '@/images/icons/EditAvatar.svg'
import Reddit from '@/images/icons/socials/Reddit.svg'
import GitHub from '@/images/icons/socials/GitHub.svg'
import Twitter from '@/images/icons/socials/Twitter.svg'
import Facebook from '@/images/icons/socials/Facebook.svg'
import Instagram from '@/images/icons/socials/Instagram.svg'
import styles from '@/styles/modules/UpdateProfile.module.scss'
import { connectWallet, signMessage } from '@/components/Wallet'
import { toast } from 'react-toastify'

export const UpdateProfile = (props: any) => {

  const [name, setName] = useState<string>(props.userData.name)
  const [bio, setBio] = useState<string>(props.userData.bio)
  const [social, setSocial] = useState<string>(props.userData.social);
  const [avatar, setAvatar] = useState<string>(props.userData.avatar)
  const [banner, setBanner] = useState<string>(props.userData.banner)
  const [avatarFile, setAvatarFile] = useState<any>(null)
  const [bannerFile, setBannerFile] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const SocialImages: any = {
    reddit: Reddit,
    github: GitHub,
    twitter: Twitter,
    facebook: Facebook,
    instagram: Instagram,
  };

  const handleclose = () => {
    props.setModalIsOpen(false)
  }

  const checkName = (input: string) => {
    setErrorMessage('')
    if (input.length > 25) {
      setErrorMessage("Name can't have more than 25 characters")
      return
    }
    setName(input)
  }

  const checkBio = (input: string) => {
    setErrorMessage('')
    if (input.length > 150) {
      setErrorMessage("Bio can't have more than 150 characters")
      return
    }
    setBio(input)
  }

  const checkSocial = (input: string) => {
    setErrorMessage('')
    if (input.length > 100) {
      setErrorMessage("Social can't have more than 100 characters")
      return
    }
    if (!"https://".startsWith(input.slice(0, 8))) {
      setErrorMessage("Social must start with https://")
      return
    }
    const social = input.slice(8).split(".")[0]
    if (!["reddit".slice(0, social.length),
    "github".slice(0, social.length),
    "instagram".slice(0, social.length),
    "facebook".slice(0, social.length),
    "twitter".slice(0, social.length)]
      .includes(social)) {
      setErrorMessage("Social can only have GitHub, Twitter, Reddit or Instagram links.")
    }
    setSocial(input)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!Object.keys(SocialImages).includes(social.slice(8).split(".")[0]) || 
      social.split(".com/").length != 2 || 
      social.split(".com/")[1].length == 0){
      setErrorMessage("Social is incomplete")
      return
    }

    const API_URL: any = process.env.NEXT_PUBLIC_API_URL
    const publicKey = await connectWallet(false)
    const signature = await signMessage(e)

    const formData = new FormData()
    avatarFile ? formData.append('avatar', avatarFile) : null
    bannerFile ? formData.append('banner', bannerFile) : null
    formData.append("name", name)
    formData.append("bio", bio)
    formData.append("social", social)
    formData.append("public_key", publicKey)
    formData.append("signature", JSON.stringify(signature))

    const loadingToastId = toast.loading("Updating")
    const res = await fetch(API_URL + '/profile/update/', {
      method: 'PUT',
      body: formData
    })
    if (res.ok) {
      router.replace(router.asPath);
      toast.dismiss(loadingToastId)
      handleclose()
    } else {
      const json = await res.json()
      toast.error(json.error)
    }

}

return (
  <div className={styles.updateModal}>
    <div className={styles.main}>
      <div className={styles.upper}>
        <h3>Update profile</h3>
        <span className={styles.close} onClick={handleclose}>&times;</span>
      </div>

      <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
        <div className={styles.bannerParent}>
          <img className={styles.banner} alt="banner" src={banner} />
          <input className={styles.bannerInput} onChange={(e) => {
            setBannerFile(e.target.files ? e.target.files[0] : null)
            setBanner(e.target.files ? URL.createObjectURL(e.target.files[0]) : '')
          }}
            id="banner-input" type="file" />

          <label className={styles.editBanner} htmlFor="banner-input">
            <Image alt="edit banner" src={EditBanner} height="30" width="30" />
          </label>
        </div>

        <div className={styles.avatarParent}>
          <Image alt="avatar" src={avatar} objectFit='cover' height="150px" width="150px" />
          <input className={styles.avatarInput} onChange={(e) => {
            setAvatarFile(e.target.files ? e.target.files[0] : null)
            setAvatar(e.target.files ? URL.createObjectURL(e.target.files[0]) : '')
          }}
            id="avatar-input" type="file" />

          <label className={styles.editAvatar} htmlFor="avatar-input">
            <Image alt="edit avatar" src={EditAvatar} height="30" width="30" />
          </label>
        </div>

        <div className={styles.textfields}>
          <h4>Name</h4>
          <input style={errorMessage.startsWith("Name") ? { border: "1px solid #ff5151" } : {}} onChange={e => checkName(e.target.value)} type="text" value={name}></input>

          <h4>Bio</h4>
          <textarea className={styles.bioField} style={errorMessage.startsWith("Bio") ? { border: "1px solid #ff5151" } : {}} onChange={e => checkBio(e.target.value)} value={bio}></textarea>

          <h4>Social</h4>
          <div style={errorMessage.startsWith("Social") ? { border: "1px solid #ff5151" } : {}} className={styles.socialField}>
            {social && ["reddit", "instagram", "twitter", "facebook", "github"].includes(social.slice(8).split(".")[0]) ?
              <Image className={styles.socialImage} src={SocialImages[social.slice(8).split(".")[0]]} height="30px" width="30px" /> :
              null}
            <input type="text" onChange={e => checkSocial(e.target.value)} value={social}></input>
          </div>

          <button type="submit" >Update</button>
        </div>

        <span className={styles.error}>{errorMessage}</span>
      </form>
    </div>
  </div>
)
}

