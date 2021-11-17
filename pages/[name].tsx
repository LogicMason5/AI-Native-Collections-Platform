import { PageHead } from '@/components/Head'
import { ProfileBox } from '@/components/ProfileBox'


export default function Profile( data: any ) {
  <PageHead title={'NodeAir - Easier, faster & insightful Solana wallet experience.'} />
  const user = data["data"]
  return (
    <ProfileBox user={user}/>
  )
}


export async function getServerSideProps(context: any) {

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const { name } = context.params
  const res = await fetch(API_URL + "/profile/" + name)
  const data = await res.json()
  return { props: { data } }
}
  