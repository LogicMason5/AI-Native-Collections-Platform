import Head from 'next/head'

export const PageHead = ({ title }: any = "Nodeair - Easier, faster and insightful Solana wallet experience.") => (
    <Head>
        <title>{title}</title>
        <meta name="title" content="NodeAir - Easier, faster & insightful Solana wallet experience."/>
        <meta name="description" content="NodeAir lets you create your public wallet profile to find each other easily. Get statistics with graphs about your transactions and activity in seconds."/>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://www.nodeair.io/"/>
        <meta property="og:title" content="NodeAir - Easier, faster & insightful Solana wallet experience."/>
        <meta property="og:description" content="NodeAir lets you create your public wallet profile to find each other easily. Get statistics with graphs about your transactions and activity in seconds."/>
        <meta property="og:image" content="https://res.cloudinary.com/f22/image/upload/v1640426936/NodeAir/Assets/banner.png"/>

        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="twitter:url" content="https://www.nodeair.io/"/>
        <meta property="twitter:title" content="NodeAir - Easier, faster & insightful Solana wallet experience."/>
        <meta property="twitter:description" content="NodeAir lets you create your public wallet profile to find each other easily. Get statistics with graphs about your transactions and activity in seconds."/>
        <meta property="twitter:image" content="https://res.cloudinary.com/f22/image/upload/v1640426936/NodeAir/Assets/banner.png"/>
    </Head>
)