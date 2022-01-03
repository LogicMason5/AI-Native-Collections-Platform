import Image from 'next/image'
import NFTBottom from '@/images/NFTBottom.svg'
import Attributes from '@/images/icons/Attributes.svg'
import styles from '@/styles/pages/NFTGallery.module.scss'

export const NFT = ({ data }: any) => {
    if (Object.keys(data).length > 1) {
        return (
            <a className={styles.nft} target="_blank" rel="noreferrer" href={`https://solscan.io/token/${data.address}`}>
                <div className={styles.image}>
                    <img src={data.image} alt="nft" />
                </div>
                <p className={styles.name} >{data.name}</p>
                <p className={styles.description} >{data.description}</p>
                <div className={styles.attributes}>
                    <div className={styles.attributeTitle}>
                        <Image src={Attributes} height="20px" width="20px" />
                        <p>Attributes</p>
                    </div>
                    <div className={styles.items}>
                        {data.attributes.map((a: any) => (
                            <div className={styles.attribute}>
                                <span>{a.trait_type}</span>
                                <span>{a.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.nftBottom}>
                    <Image src={NFTBottom} />
                </div>
            </a>

        )
    } else {
        return (
            <a className={styles.nft} target="_blank" rel="noreferrer" href={`https://solscan.io/token/${data.address}`}>
                <h3>Unable to fetch data</h3>
            </a>
        )
    }

}

