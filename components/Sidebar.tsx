import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from "next/router"
import DashboardIcon from '@/images/sidebar/DashboardIcon.svg'
import InsightsIcon from '@/images/sidebar/InsightsIcon.svg'
import ProfileIcon from '@/images/sidebar/ProfileIcon.svg'
import NFTGalleryIcon from '@/images/sidebar/NFTGalleryIcon.svg'
import styles from '@/styles/modules/Sidebar.module.scss'
import { useEffect, useState } from 'react'
import { connectWallet } from './Wallet'

export const Sidebar = () => {

    const [name, setName] = useState<string>('')

    useEffect(() => {
        const fetchName = async() => {
            const API_URL: any = process.env.NEXT_PUBLIC_API_URL
            const publicKey = await connectWallet(false, false)
            const res = await fetch(API_URL + "/checks/user/" + publicKey)
            if (res.ok) {
                const json = await res.json()
                setName(json.username)
            } else {
                setName("bolt")
            }
        }
        setTimeout(() => fetchName(), 500)
      }, []);

      const SidebarItem = ({ icon, link, path }: { icon: any, link: string, path: string }) => {
        const router = useRouter()
        return (
            <div className={(link == "Profile" && router.pathname == "/[name]") ? styles.icon_active : router.pathname == path ? styles.icon_active : styles.icon}>
                <Link href={path}>
                    <a>
                        <Image src={icon} alt="icon" height="25" width="25"/>
                        <p>{link}</p>
                    </a>
                </Link>
            </div>
        )
    }
    
    
    return (
        <nav className={styles.sidebar}>
            <ul className={styles.links}>
                <SidebarItem icon={DashboardIcon} link="Dashboard" path="/dashboard"/>
                <SidebarItem icon={InsightsIcon} link="Insights" path="/insights"/>
                <SidebarItem icon={NFTGalleryIcon} link="NFT Gallery" path="/nfts"/>
                <SidebarItem icon={ProfileIcon} link="Profile" path={name}/>
            </ul>
        </nav>
    )
}

