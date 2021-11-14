import { MouseEventHandler } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const connectWallet = async () => {
  const notify = () => toast("Wow so easy!");

  if ("solana" in window) {
    // @ts-ignore
    const res = await window.solana.connect();
    const button = document.querySelector(".Navbar_connect_button__32n_j")
    if (button != null) {
      const pubKey = res.publicKey.toString()
      let start =pubKey.substring(0, 5)
      let end = pubKey.substring(39, 44)
      button.innerHTML = start + "..." + end
    }
    toast.success('Connected to wallet!', {
      position: "top-center",
      autoClose: 2000,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "dark"
      });
    return (
      <>
      </>
    )
  }
  window.open("https://phantom.app/", "_blank");
}

export const registerWallet = async () => {
  toast.info('Create profiles feature tomorrow!', {
    position: "top-center",
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    theme: "dark"
    });
  const { API_URL }: any = "http://localhost:8000/";

  const pubKey = await connectWallet();
  let data
  if (pubKey != null) {
    data = {
      public_key: pubKey.toString()
    }
  }

  fetch(`${API_URL}/register`, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST"
    })
    .then((res) => console.log(res.json())).catch((err) => console.log(err))
  }
