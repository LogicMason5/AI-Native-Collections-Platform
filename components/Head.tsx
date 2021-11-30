import Head from 'next/head'

type Props = {
    title: string
}

export const PageHead = ({ title }: Props) => (
    <Head>
        <title>{title}</title>
        <meta name="title" content="Nodeair - Easier, faster and insightful Solana wallet experience."/>
        <meta name="description" content="Create your wallet profile to know about each other more. Get visual representation with graphs about your transactions and activity in seconds."/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://nodeair.io"/>
        <meta property="og:title" content="Nodeair - Easier, faster and insightful Solana wallet experience."/>
        <meta property="og:description" content="Create your wallet profile to know about each other more. Get visual representation with graphs about your transactions and activity in seconds."/>
        <meta property="og:image" content="https://res.cloudinary.com/f22/image/upload/v1638265125/NodeAir/Assets/Banner_yigtrr.png"/>

        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="twitter:url" content="https://nodeair.io/"/>
        <meta property="twitter:title" content="Nodeair - Easier, faster and insightful Solana wallet experience."/>
        <meta property="twitter:description" content="Create your wallet profile to know about each other more. Get visual representation with graphs about your transactions and activity in seconds."/>
        <meta property="twitter:image" content="https://res.cloudinary.com/f22/image/upload/v1638265125/NodeAir/Assets/Banner_yigtrr.png"/>
        <meta name="keywords" content="Cryptocurrencies, Crypto, Solana, Data Visualization, Solana Data Analytics" />
    </Head>
)