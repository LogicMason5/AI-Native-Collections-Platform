import Image from 'next/image'
import Search from '@/images/Search.svg'
import styles from '@/styles/modules/Bookmarks.module.scss'

export const Bookmarks = () => {
    return (
      <div className={styles.bookmarks}>
      <h2>Bookmarks</h2>
      <form className={styles.search}>
        <input type="text" placeholder="Search bookmarks" />
        <button type="submit">
          <Image src={Search}/>
        </button>
      </form>

        <div className={styles.bookmark}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Red_Circle%28small%29.svg/2048px-Red_Circle%28small%29.svg.png"/>
          <h3>Bolt</h3>
          <p>afioahgjonr2399sdaskl</p>
        </div>

        <div className={styles.bookmark}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjKSuDFps_W7zr9oBVbgIn7DuB8rbHvLu2dg&usqp=CAU"/>
          <h3>Bolt</h3>
          <p>afioahgjonr2399sdaskl</p>
        </div>

        <div className={styles.bookmark}>
          <img src="https://static01.nyt.com/images/2021/09/14/science/07CAT-STRIPES/07CAT-STRIPES-mediumSquareAt3X-v2.jpg"/>
          <h3>Bolt</h3>
          <p>afioahgjonr2399sdaskl</p>
        </div>
      </div>
    )
  }
  