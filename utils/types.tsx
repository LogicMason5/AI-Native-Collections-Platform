export type Transaction = {
    _id: string
    blockTime: number,
    decimals: number,
    dst: string,
    fee: number,
    lamport: number,
    slot: number,
    src: string,
    status: string,
    txHahs: string,
    txNumberSolTransfer: number
}