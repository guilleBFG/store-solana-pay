import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction
} from "@solana/web3.js";
import {createTransferCheckedInstruction, getAssociatedTokenAddress, getMint } from '@solana/spl-token'
import products from "./products.json";
import BigNumber from "bignumber.js";


const usdcAddress = new PublicKey(process.env.NEXT_PUBLIC_USDC_ADDRESS);
const sellerAddress = process.env.NEXT_PUBLIC_SELLER_ADDRESS;
const sellerPublicKey = new PublicKey(sellerAddress);

const createTransaction = async (req, res) => {
  try {
    const { buyer, orderID, itemID } = req.body;

    if (!buyer) {
      return res.status(400).json({
        message: "missing buyer address",
      });
    }
    if (!orderID) {
      return res.status(400).json({
        message: "missing order ID",
      });
    }

    const itemPrice = products.find((item) => item.id === itemID).price;

    if (!itemPrice) {
      return res.status(404).json({
        message: "Item not found please check item ID",
      });
    }

    // Convert to correct format

    const bigAmount = BigNumber(itemPrice);
    const buyerPublicKey = new PublicKey(buyer);

    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);


    const buyerUsdcAddress = await getAssociatedTokenAddress(usdcAddress,buyerPublicKey);
    const shopUsdcAddress  = await getAssociatedTokenAddress(usdcAddress,sellerPublicKey);
    
    // A blockhash is sort of like an ID for a block. It lets you identify each block.
    const { blockhash } = await connection.getLatestBlockhash("finalized");


    // This is new, we're getting the mint address of the token we want to transfer
    const usdcMint = await getMint(connection,usdcAddress);

    // The first two things we need - a recent block ID
    // and the public key of the fee payer
  
    const tx = new Transaction({
      recentBlockhash: blockhash,
      blockhash: blockhash,
      feePayer: buyerPublicKey,
    });

    // Here we're creating a different type of transfer instruction
    const transferInstruction = createTransferCheckedInstruction(
      buyerUsdcAddress,
      usdcAddress, //address of the token we want to transfer
      shopUsdcAddress,
      buyerPublicKey,
      bigAmount.toNumber() * 10 ** (await usdcMint).decimals,
      usdcMint.decimals // the token could have any number of decimals
    );
   

    //adding instruction to transaction
    transferInstruction.keys.push({
      // We'll use our OrderId to find this transaction later
      pubkey: new PublicKey(orderID),
      isSigner: false,
      isWritable: false,
    });

    tx.add(transferInstruction);

    //formatting transaction
    const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
    });
    const base64 = serializedTransaction.toString("base64");

    res.status(200).json({
      transaction: base64,
    });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error creating tx" });
    return;
  }
}

export default function handler(req,res){
  if(req.method === 'POST'){
    createTransaction(req,res);
  }else{
    res.return(405).end();
  }
}
