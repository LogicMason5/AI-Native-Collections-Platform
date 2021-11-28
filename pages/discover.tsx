import Router from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
export default function Discover() {
    useEffect(() => {
        const name = localStorage.getItem("username")
        if (name != null || undefined){
            Router.push("/" + name)
        } else {
            Router.push("/bolt")
        }
    } ,[])

    return (
        <>
        </>
    )
}   


