import { useEffect, useState } from 'react'
import { GlowGradiant } from '@/utils/gradiants'

import styles from '@/styles/modules/Tokens.module.scss'

export const Tokens = ({ data, unavailableTokenCount}: any) => {
  const [tokenData, setTokenData] = useState<any>()

  useEffect(() => {
    const logos = Object.keys(data).map(t => data[t].logo)
    const symbols = Object.keys(data).map(t => data[t].symbol)
    const values = Object.keys(data).map(t => data[t].usd)
    const sum = values.reduce((a, b) => a + b, 0)

    let percentages = {}
    for (const i of values) {

      percentages = { ...percentages, [symbols[values.indexOf(i)]]: { "percentage": (i / sum) * 100, "logo": logos[values.indexOf(i)], "symbol": symbols[values.indexOf(i)] } }
    }
    setTokenData(percentages)
  }, []);
  return (
    <div className={styles.parent}>
      {tokenData ? (Object.keys(tokenData).map((tokenName: any) => (
        <div className={styles.token}>
          <div style={{
            background: GlowGradiant[Object.keys(tokenData).indexOf(tokenName)],
            boxShadow: GlowGradiant[Object.keys(tokenData).indexOf(tokenName)] + " 0px 0px 50px"
          }}></div>
          <img src={tokenData[tokenName].logo} height={50} width={50} />
          <p>{tokenName}</p>
          <p className={styles.percentage}>
            {Math.round(tokenData[tokenName].percentage) == 0 ? "< 1%" : Math.round(tokenData[tokenName].percentage) + "%"}
          </p>
        </div>
      ))
      ) : null
      }
      <p>{(unavailableTokenCount != 0) ? "Unable to fetch data for " + unavailableTokenCount + " tokens" : null}</p>
    </div>
  )
}
