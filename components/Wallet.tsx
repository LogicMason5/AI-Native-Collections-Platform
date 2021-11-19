import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Connection, Transaction, SystemProgram, PublicKey } from '@solana/web3.js'


export const connectWallet = async (showToast: boolean) => {
  if ("solana" in window) {
    let res
    try{
      res = await window.solana.connect({ onlyIfTrusted: true })
    } catch {
      res = await window.solana.connect()
    }
    const button = document.querySelector(".Navbar_connect_button__32n_j")
    if (button != null) {
      const pubKey = res.publicKey.toString()
      let start =pubKey.substring(0, 5)
      let end = pubKey.substring(39, 44)
      button.innerHTML = start + "..." + end
    }
    if (showToast){toast.success('Connected to wallet!');}
    return res.publicKey;
  } 
    window.open("https://phantom.app/", "_blank");
  }


export const usdToSol = async (usd: number ) => {
  let price;
  const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT")
  price = await res.json()
  price = price.price 
  return usd/price
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
  } catch (error) {
    toast.error("Transaction rejected")
    return false
  }
}


export const registerWallet = async (event: any, username: string, usd: number) => {
  console.log("Initial USD: ", usd)
  event.preventDefault();

  const API_URL: any = process.env.NEXT_PUBLIC_API_URL;
  let pubKey = window.solana._publicKey
  if (pubKey == null) {
    pubKey = await connectWallet(true)
  }
  const data = {
      public_key: pubKey.toString(),
      username: username
    }

    fetch(`${API_URL}/check`, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST"
    })
    .then (async res => {
      if (res.ok) {
        const payment = await sendPayment(new PublicKey("B3BhJ1nvPvEhx3hq3nfK8hx4WYcKZdbhavSobZEA44ai"), usd)
        if(payment) {
          fetch(`${API_URL}/register`, {
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST"
          })
          .then (async res => {
            if (res.ok) {
              toast.success("Profile registered successfully!")
            } else {
              toast.error("Uh oh something went wrong!")
            }
          })
        }
      } else {
        fetch(`${API_URL}/check`, {
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST"
        })
        .then (async res => {
          if (res.ok) {
            const payment = await sendPayment(new PublicKey("B3BhJ1nvPvEhx3hq3nfK8hx4WYcKZdbhavSobZEA44ai"), usd)
            if(payment) {
              fetch(`${API_URL}/register`, {
                body: JSON.stringify(data),
                headers: {
                  "Content-Type": "application/json"
                },
                method: "POST"
              })
              .then (async res => {
                if (res.ok) {
                  toast.success("Profile registered successfully!")
                } else {
                  toast.error("Uh oh something went wrong!")
                }
              })
            }
          } else {
            res.json().then(json => toast.error(json.error))
          }
        })
      }
    })
}

// export const signMessage = async (e: any, message: string) => {
//   e.preventDefault();
//   await connectWallet(false)
//   const data = new TextEncoder().encode(message);
//   const API_URL: any = process.env.NEXT_PUBLIC_API_URL;

//   const res = await window.solana.signMessage(data, "utf8");
//   const sig = res.signature
  
//   fetch(`${API_URL}/signature`, {
//     body: res,
//     headers: {"Content-Type": "application/json"},
//     method: "POST"
//   }
//   )
//   }


/*
- Generate a random hash in the backend and save it in db
- Get it signed from the wallet in frontend

- Send the signed signature to backend
- Backend verifies the hash from the db using signautre from frontend
*/
