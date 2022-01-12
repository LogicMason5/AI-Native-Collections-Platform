import { useEffect, useState } from 'react'
import { GlowGradiant } from '@/utils/gradiants'

import styles from '@/styles/modules/Tokens.module.scss'

export const Tokens = ({ data, unfetchedTokenCount, byAmount}: any) => {
  const [tokenData, setTokenData] = useState<any>()
  const [fetchedTokenData, setFetchedTokenData] = useState<any>()
  const [unfetchedTokenData, setUnfetchedTokenData] = useState<any>()
  useEffect(() => {
    //@ts-ignore
    const unfetchedData = Object.fromEntries(Object.entries(data).filter(([key, value]) => "unfetched" in value)) 
    const logos = Object.keys(data).map(t => data[t].logo)
    const symbols = Object.keys(data).map(t => data[t].symbol)
    const values = Object.keys(data).map(t => byAmount ? data[t].amount : data[t].value).filter((value) => typeof value !== "undefined")
    const sum = values.reduce((a, b) => a + b, 0)
    let percentages = {}
    console.log(values)
    for (let i = 0; i < values.length; i++) {
      percentages = { ...percentages, [symbols[i]]: { "percentage": (values[i] / sum) * 100, "logo": logos[i], "symbol": symbols[i] } }
    }

    setTokenData(percentages)
    console.log(percentages)
    setUnfetchedTokenData(unfetchedData)
    // setFetchedTokenData(unfetchedData)
  }, [byAmount]);

  return (
    <div className={styles.parent}>
      {tokenData ? (Object.keys(tokenData).map((tokenName: any) => (
        <div key={tokenName} className={styles.token}>
          <div style={{
            background: GlowGradiant[Object.keys(tokenData).indexOf(tokenName)],
            boxShadow: GlowGradiant[Object.keys(tokenData).indexOf(tokenName)] + " 0px 0px 50px"
          }}></div>
          <img src={tokenData[tokenName].logo} height={50} width={50} alt="logo"/>
          <p>{tokenName}</p>
          <p className={styles.percentage}>
            {tokenData[tokenName].percentage == 0 ? "0%" : Math.round(tokenData[tokenName].percentage) <  1 ? "< 1%" : Math.round(tokenData[tokenName].percentage) + "%"}
          </p>
        </div>
      ))
      ) : null
      }

  {!byAmount && unfetchedTokenData ? (Object.keys(unfetchedTokenData).map((tokenName: any) => (
          <div key={tokenName} className={styles.token}>
            <div style={{
              background: GlowGradiant[Object.keys(unfetchedTokenData).length + Object.keys(unfetchedTokenData).indexOf(tokenName)],
              boxShadow: GlowGradiant[Object.keys(unfetchedTokenData).length + Object.keys(unfetchedTokenData).indexOf(tokenName)] + " 0px 0px 50px"
            }}></div>
            <img src={unfetchedTokenData[tokenName].logo} height={50} width={50} alt="logo"/>
            <p>{unfetchedTokenData[tokenName].symbol}</p>
            <p className={styles.percentageNotFound}>
              Not listed <span>i</span>
              <span className={styles.toolTip}>The token's percentage cannot be determined since it is not listed on CoinGecko and price cannot be fetched</span>

            </p>
          </div>
        ))
        ) : null
        }
      <p>{(unfetchedTokenCount != 0) ? "Unable to fetch data for " + unfetchedTokenCount + " tokens" : null}</p>
    </div>
  )
}
