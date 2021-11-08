export default function Profile( data: Object ) {
  console.log(data)
  return (
    <h1>{JSON.stringify(data)}</h1>
  )
}


export async function getServerSideProps(context: any) {

  const { name } = context.params
  const res = await fetch(`http://localhost:8000/profile/${name}`)
  const data = await res.json()
  return { props: { data } }
}
  