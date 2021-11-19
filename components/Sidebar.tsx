import Link from 'next/link'
import Image from 'next/image'
import Bargraph from '@/images/icons/Bargraph.svg'
import Edit from '@/images/icons/Edit.svg'
import Piechart from '@/images/icons/Piechart.svg'
import History from '@/images/icons/History.svg'
import Settings from '@/images/icons/Settings.svg'
import styles from '@/styles/modules/Sidebar.module.scss'

export const Sidebar = () => {

    return (
        <nav className={styles.sidebar}>
          <ul className={styles.links}>
            <SidebarIcon icon={Bargraph} link="Dashboard"/>
            <SidebarIcon icon={Edit} link="Edit Profile"/>
            <SidebarIcon icon={Piechart} link="Insights"/>
            <SidebarIcon icon={History} link="History"/>
            <SidebarIcon icon={Settings} link="Settings"/>
          </ul>
        </nav>
    )
}

const SidebarIcon = ({icon, link}: {icon: any, link: String}) => {
    return (
        <div className={styles.icon}>
            <Image src={icon}></Image>
            <Link href={"/"+ link.toLowerCase().replace(" ", '')}>{link}</Link>
        </div>
    )
}
    
