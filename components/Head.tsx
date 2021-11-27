import Head from 'next/head'

type Props = {
    title: string
}

export const PageHead = ({ title }: Props) => (
    <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="title" content={title} />
        <meta name="description" content="Create your wallet profile to know about each other more. Get visual representation with graphs about your transactions and activity in seconds." />
        <meta name="keywords" content="Cryptocurrencies, Crypto, Solana, Data Visualization, Solana Data Analytics" />
    </Head>
)