import React, { useMemo, useState, useEffect } from "react";
import { Keypair, Transaction } from "@solana/web3.js";
import {findReference, FindReferenceError} from '@solana/pay';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import IPFSDownload from "./IPFSDownload";
import { addOrder, hasPurchased } from "../lib/api";

const STATUS = {
  Initial:"Initial",
  Submitted: "Submitted",
  Paid: "Paid",
}
function Buy({ itemID }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []);
 
  const [status, setStatus] = useState(STATUS.Initial);
  const [loading, setLoading] = useState(false);

  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  );

  const processTransaction = async () => {
    setLoading(true);
    const txResponse = await fetch("../api/createTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    const txData = await txResponse.json();

    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));

    try {
      const txHash = await sendTransaction(tx, connection);
      console.log(
        `Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`
      );
      // Even though this could fail, we're just going to set it to true for now
      setStatus(STATUS.Submitted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    async function checkPurchased(){
      const purchased = await hasPurchased(publicKey,itemID);
      if(purchased){
        setStatus(STATUS.Paid);
        console.log("address has already purchased this item")
      }
    }
    checkPurchased();

  },[publicKey,itemID])
  useEffect(()=>{
    if(status === STATUS.Submitted){
      setLoading(true);
      const interval = setInterval(async () =>{
        try {
          const result = await findReference(connection,orderID);
          console.log("finding tx reference", result.confirmationStatus);
          if(result.confirmationStatus === "confirmed" || result.confirmationStatus === "finalized"){
            clearInterval(interval);
            setStatus(STATUS.Paid);
            setLoading(false);
            addOrder(order);
            alert("thank you for your purchase");

          }
        } catch (error) {
          if(error instanceof FindReferenceError){
            return null;
          }
          console.error("unknown error", error);
        }finally{
          setLoading(false);
        }
      },1000);
      return () => {
        clearInterval(interval);
      }
    }
  },[status]);


  
  if (!publicKey) {
    return (
      <div className="text-red-900 font-extrabold text-3xl">
        Connect your wallet to make a transaction
      </div>
    );
  }

  if (loading) {
    return (
      <button
        type="button"
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full inline-flex items-center"
        disabled
      >
        <svg
          role="status"
          className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>{" "}
        Processing...
      </button>
    );
  }

  return (
    <div>
      {status === STATUS.Paid ? (
        <IPFSDownload
          filename="emojis.zip"
          hash="QmWWH69mTL66r3H8P4wUn24t1L5pvdTJGUTKBqT11KCHS5"
          cta="Download emojis"
        />
      ) : (
        <button
          disabled={loading}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full inline-flex items-center"
          onClick={processTransaction}
        >
          Buy Now!
        </button>
      )}
    </div>
  );
}

export default Buy;
