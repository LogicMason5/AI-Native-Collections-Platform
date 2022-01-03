import styles from '@/styles/pages/NFTGallery.module.scss'

export const NFT = ({ data }: any) => {
    if (data != null) {
        console.log(data.attributes)
        return (
            <a className={styles.nft} href={data.image}>
                <div className={styles.image}>
                    <img src={data.image} alt="nft" />
                </div>
                <p className={styles.name} >{data.name}</p>
                <p className={styles.description} >{data.description}</p>
                <div className={styles.attributes}>
                    <p>Attributes</p>
                    {data.attributes.map((a: any) => (
                        <div className={styles.attribute}>
                            <span>{a.trait_type}</span>
                            <span>{a.value}</span>
                        </div>
                        ))}

                </div>
            </a>

        )
    } else {
        return (
            <div className={styles.nft}>
                <h3>Unable to fetch data</h3>
            </div>
        )
    }

}

