import Router from 'next/router';
import { useEffect } from 'react';
export default function Discover() {
    useEffect(() => {
        Router.push("/bolt")
    } ,[])

    return (
        <>
        </>
    )
}   


