import { useEffect, useState } from 'react'
import { GlowGradiant } from '@/utils/gradiants'

import styles from '@/styles/modules/Tokens.module.scss'

export const Tokens = ({ data, unfetchedTokenCount, byAmount }: any) => {

  const [tokenData, setTokenData] = useState<any>()
  const [unfetchedTokenData, setUnfetchedTokenData] = useState<any>()
  useEffect(() => {
    //@ts-ignore
    const unfetchedData = Object.fromEntries(Object.entries(data).filter(([key, value]) => "unfetched" in value))
    const logos = Object.keys(data).map(t => data[t].logo)
    const symbols = Object.keys(data).map(t => data[t].symbol)
    const values = Object.keys(data).map(t => byAmount ? data[t].amount : data[t].value).filter((value) => typeof value !== "undefined")
    const sum = values.reduce((a, b) => a + b, 0)
    let percentages = {}
    for (let i = 0; i < values.length; i++) {
      let perc = (values[i] / sum) * 100
      if(isNaN(perc)){
        perc = 0
      }
      percentages = { ...percentages, [symbols[i]]: { "percentage": perc, "logo": logos[i], "symbol": symbols[i] } }
    }
    if (byAmount) {
       const sort = (obj: any, valSelector: any) => {
         const sortedEntries = Object.entries(obj)
           .sort((a, b) =>
             valSelector(a[1]) > valSelector(b[1]) ? -1 :
               valSelector(a[1]) < valSelector(b[1]) ? 1 : 0);
         return new Map(sortedEntries);
       }
       //@ts-ignore
       var sortedMap = sort(percentages, val => val.percentage);
       var sortedObj = {};
       //@ts-ignore
       sortedMap.forEach((v, k) => { sortedObj[k] = v }) 
       setTokenData(sortedObj)
    } else {
      setTokenData(percentages)
    }

    setUnfetchedTokenData(unfetchedData)
  }, [byAmount, data]);

  return (
    <div className={styles.parent}>
      {tokenData ? (Object.keys(tokenData).map((tokenName: any) => (
        <div key={tokenName} className={styles.token}>
          <div style={{
            background: GlowGradiant[Object.keys(tokenData).indexOf(tokenName)],
            boxShadow: GlowGradiant[Object.keys(tokenData).indexOf(tokenName)] + " 0px 0px 50px"
          }}></div>
          <img src={tokenData[tokenName].logo} height={50} width={50} alt="logo" />
          <p>{tokenName}</p>
          <p className={styles.percentage}>
            {tokenData[tokenName].percentage == 0 ? "0%" : Math.round(tokenData[tokenName].percentage) < 1 ? "< 1%" : Math.round(tokenData[tokenName].percentage) + "%"}
          </p>
        </div>
      ))
      ) : null
      }

      {!byAmount && unfetchedTokenData ? (Object.keys(unfetchedTokenData).map((tokenName: any) => (
        <div key={tokenName} className={styles.token}>
          <div style={{
            background: GlowGradiant[Object.keys(tokenData).length + Object.keys(unfetchedTokenData).indexOf(tokenName)],
            boxShadow: GlowGradiant[Object.keys(tokenData).length + Object.keys(unfetchedTokenData).indexOf(tokenName)] + " 0px 0px 50px"
          }}></div>
          <img src={unfetchedTokenData[tokenName].logo} height={50} width={50} alt="logo" />
          <p>{unfetchedTokenData[tokenName].symbol}</p>
          <p className={styles.percentageNotFound}>
            Not listed <span>i</span>
            <span className={styles.toolTip}>The token&apos;s percentage cannot be determined since it is not listed on CoinGecko and price cannot be fetched</span>

          </p>
        </div>
      ))
      ) : null
      }
      <p>{(unfetchedTokenCount != 0) ? "Unable to fetch data for " + unfetchedTokenCount + " tokens" : null}</p>
    </div>
  )
}
