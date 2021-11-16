import { PageHead } from '@/components/Head'

export default function Profile( data: Object ) {
  <PageHead title={'NodeAir - Easier, faster & insightful Solana wallet experience.'} />
  console.log(data)
  return (
    <h1>{JSON.stringify(data)}</h1>
  )
}


export async function getServerSideProps(context: any) {

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const { name } = context.params
  const res = await fetch(API_URL + "/profile/" + name)
  const data = await res.json()
  return { props: { data } }
}
  