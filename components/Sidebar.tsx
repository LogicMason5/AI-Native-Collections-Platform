import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from "next/router"
import DashboardIcon from '@/images/sidebar/DashboardIcon.svg'
import InsightsIcon from '@/images/sidebar/InsightsIcon.svg'
import DiscoverIcon from '@/images/sidebar/DiscoverIcon.svg'
import styles from '@/styles/modules/Sidebar.module.scss'


export const Sidebar = () => {
    return (
        <nav className={styles.sidebar}>
            <ul className={styles.links}>
                <SidebarItem icon={DashboardIcon} link="Dashboard" path="/dashboard"/>
                <SidebarItem icon={InsightsIcon} link="Insights" path="/insights"/>
                <SidebarItem icon={DiscoverIcon} link="Discover" path="/discover"/>
            </ul>
        </nav>
    )
}

const SidebarItem = ({ icon, link, path }: { icon: any, link: string, path: string }) => {
    const router = useRouter()
    return (
        <div className={router.pathname == path ? styles.icon_active : styles.icon}>
            <Link href={path}>
                <a>
                    <Image src={icon} alt="icon" height="30" width="30"/>
                    <p>{link}</p>
                </a>
            </Link>
        </div>
    )
}
