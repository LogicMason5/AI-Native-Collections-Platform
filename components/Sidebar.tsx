import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from "next/router"
import DashboardIcon from '@/images/sidebar/DashboardIcon.svg'
import InsightsIcon from '@/images/sidebar/InsightsIcon.svg'
import EditIcon from '@/images/sidebar/EditIcon.svg'
import DiscoverIcon from '@/images/sidebar/DiscoverIcon.svg'
import HistoryIconIcon from '@/images/sidebar/HistoryIcon.svg'
import Settings from '@/images/sidebar/SettingsIcon.svg'
import styles from '@/styles/modules/Sidebar.module.scss'


export const Sidebar = () => {
    const router = useRouter()

    const SidebarIcon = ({ icon, link, path }: { icon: any, link: string, path: string }) => {
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

    return (
        <nav className={styles.sidebar}>
            <ul className={styles.links}>
                <SidebarIcon icon={DashboardIcon} link="Dashboard" path="/dashboard"/>
                <SidebarIcon icon={InsightsIcon} link="Insights" path="/insights"/>
               {/* <SidebarIcon icon={Edit} link="Edit Profile"/> */}
                <SidebarIcon icon={DiscoverIcon} link="Discover" path="/bolt"/>
                {/* <SidebarIcon icon={History} link="History"/> */}
                {/* <SidebarIcon icon={Settings} link="Settings"/> */}
            </ul>
        </nav>
    )
}

