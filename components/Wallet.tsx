import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Connection, Transaction, SystemProgram, PublicKey } from '@solana/web3.js'
import Router from 'next/router';

export const connectWallet = async (showToast: boolean) => {
  if ("solana" in window) {
    let res
    try {
      res = await window.solana.connect({ onlyIfTrusted: true })
    } catch {
      res = await window.solana.connect()
    }
    const button = document.querySelector(".Navbar_connect_button__32n_j")
    if (button != null) {
      const pubKey = res.publicKey.toString()
      let start = pubKey.substring(0, 5)
      let end = pubKey.substring(39, 44)
      button.innerHTML = start + "..." + end
    }
    if (showToast) { toast.success('Connected to wallet!'); }
    return res.publicKey;
  }
  window.open("https://phantom.app/", "_blank");
}


export const usdToSol = async (usd: number) => {
  let price;
  const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT")
  price = await res.json()
  price = price.price
  return usd / price
}


export const sendPayment = async (to: PublicKey, usd: number) => {
  const sol = await usdToSol(usd)
  console.log("Converted SOL: ", sol)

  const publicKey = await connectWallet(false);
  const network = "https://api.devnet.solana.com";
  const connection = new Connection(network);
  const transaction = new Transaction()
    .add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: to,
        lamports: Number(sol) * 1000000000
      })
    );
  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = publicKey;
  try {
    const signedTransaction = await window.solana.signTransaction(transaction);
    const txid = await connection.sendRawTransaction(signedTransaction.serialize());
    const loadingToastId = toast.loading("Confirming transaction, this will take a few seconds...")
    await connection.confirmTransaction(txid);
    toast.dismiss(loadingToastId)
    toast.info("Transaction complete!")
    return true
  } catch (error: any) {
    if (error.code == 4001) {
      toast.error("Transaction rejected")
    } else {
      toast.error("Insufficient balance")
    }

    return false
  }
}


export const registerWallet = async (event: any, username: string, usd: number) => {
  console.log("Initial USD: ", usd)
  event.preventDefault();

  const API_URL: any = process.env.NEXT_PUBLIC_API_URL;
  let pubKey = window.solana._publicKey
  if (pubKey == null) {
    pubKey = await connectWallet(false)
  }
  const data = {
    public_key: pubKey.toString(),
    username: username
  }
  fetch(`${API_URL}/check`, {
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  })
    .then(async res => {
      if (res.ok) {
        const payment = true || await sendPayment(new PublicKey("B3BhJ1nvPvEhx3hq3nfK8hx4WYcKZdbhavSobZEA44ai"), usd)
        if (payment) {
          fetch(`${API_URL}/register`, {
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST"
          })
            .then(async res => {
              if (res.ok) {
                Router.push("/dashboard")
              } else {
                toast.error("Uh oh something went wrong!")
              }
            })
        }
      } else {
        res.json().then(json => {
          if (json.error == "Public key already registered") {
            toast.info(`${json.error}\nRedirecting to dashboard...`, { autoClose: 3000, toastId: "to_prevent_duplication"})
            console.log(json)
            localStorage.setItem("username", json.username)
            setTimeout(() => Router.push("/dashboard"), 3000)

          } else {
            toast.error(json.error, {toastId: "to_prevent_duplication"})
          }

        })
      }
    })
}


export const signMessage = async (e: any) => {
  e.preventDefault();
  const API_URL: any = process.env.NEXT_PUBLIC_API_URL;
  const publicKey = await connectWallet(false);
  const res = await fetch(`${API_URL}/signature/create`, {
    body: JSON.stringify({ public_key: publicKey.toString() }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (res.ok) {
    const json = await res.json();
    const message = new TextEncoder().encode(json.hash);
    const sig = await window.solana.signMessage(message, "utf8");
    return sig.signature;
  } else {
    toast.error("You are being rate limited");
  }

};



