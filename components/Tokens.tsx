import Image from 'next/image'
import { useEffect } from 'react'


export const SmexyTokens = ({data}: any) => {
  const logos = Object.keys(data).map(t => data[t].logo)
  const addresses = Object.keys(data).map(t => data[t].address)
  const percentages = new Array()
  
  useEffect(() => {
    const getData = async () => {
      const res = await fetch("https://api.sonar.watch/latest")
      if (res.ok) {
        setTimeout(async() => {
          const json = await res.json()
          const pricesSort = Object.keys(json["prices"]).filter(t => addresses.includes(t)) // Not all tokens may have their prices
          const prices = new Array()
          for (const i of pricesSort){
            console.log(json["prices"][i]["value"])
          }
        }, 1000)


      }
    }
    getData()

  }, []);


  


  return (
    <div>

    </div>
  )
}
