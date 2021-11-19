import Image from 'next/image'
import styles from '@/styles/modules/ProfileBox.module.scss'
import Copy from '@/images/icons/Copy.svg'


export const ProfileBox = ({ user, activity }: any) => {

    const joined = user.joined_on.substring(0, 10)
    const months: any = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    }
    const split = joined.split("-")
    const month = months[split[1]]
    const joined_on = split[0] + " " + month + " " + split[2]
    return (
        <div className={styles.parent}>

            <div className={styles.profilebox}>

                <div className={styles.uppersection}>
                    <img className={styles.avatar} src={user.avatar} alt="avatar" height="150" />
                    <h1>{user.username}</h1>
                    <img className={styles.banner} src={user.banner} alt="banner" height="200" />
                </div>

                <div className={styles.address}>
                    <p>{user.public_key}</p>
                    <Image className={styles.copy} src={Copy} alt="copy" height="30" width="30" />
                </div>

                <div className={styles.bio}>
                    <h2>Bio</h2>
                    <p>{user.bio}</p>
                    <hr />
                </div>
                <div className={styles.activity}>
                    {activity ? (activity.map((a: any) => (
                            <div className="transaction">
                                
                            </div>
                            
                            ))
                            )  : "Not fetched yet"}
                </div>
                <div className={styles.bottom}>
                    <p>{joined_on}</p>
                </div>

            </div>
        </div>

    )
}

