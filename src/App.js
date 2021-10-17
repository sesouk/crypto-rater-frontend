import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/CryptoRater.json'

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("")
  const [plusCount, setPlus] = useState("")
  const [minusCount, setMinus] = useState("")

  const contractAddress = "0xF6E6471D94d7B51B769f7804e3F1732b6020cf69"

  const contractABI = abi.abi

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log("Found an authorized acccount:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
  }
}

const getCounts = async () => {
  try {
    const { ethereum } = window

    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const cryptoRateContract = new ethers.Contract(contractAddress, contractABI, signer)

    let plusCount = await cryptoRateContract.getPlus()
    console.log("Received thumbs up count...", plusCount.toNumber());

    let minusCount = await cryptoRateContract.getMinus()
    console.log("Received thumbs down count...", minusCount.toNumber());

    setPlus(plusCount.toNumber())
    setMinus(minusCount.toNumber())
  } catch (error) {
    console.log(error);
  }
}

const connectWallet = async () => {
  try {
    const { ethereum } = window

    if (!ethereum) {
      alert("Get MetaMask!")
      return
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" })

    console.log("Connected", accounts[0]);
    setCurrentAccount(accounts[0])
  } catch (error) {
    console.log(error);
  }
}

  const plus = async () => {
    try {
      const { ethereum } = window
      
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const cryptoRateContract = new ethers.Contract(contractAddress, contractABI, signer)

        let plusCount = await cryptoRateContract.getPlus()
        console.log("Received thumbs up count...", plusCount.toNumber());

        const plusTxn = await cryptoRateContract.plus()
        console.log("Mining...", plusTxn.hash);

        await plusTxn.wait()
        console.log("Mined -- ", plusTxn.hash);

        plusCount = await cryptoRateContract.getPlus()
        console.log("Received thumbs up count...", plusCount.toNumber());

        setPlus(plusCount.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const minus = async () => {
    try {
      const { ethereum } = window
      
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const cryptoRateContract = new ethers.Contract(contractAddress, contractABI, signer)

        let minusCount = await cryptoRateContract.getMinus()
        console.log("Received thumbs down count...", minusCount.toNumber());

        const minusTxn = await cryptoRateContract.minus()
        console.log("Mining...", minusTxn.hash);

        await minusTxn.wait()
        console.log("Mined -- ", minusTxn.hash);

        minusCount = await cryptoRateContract.getMinus()
        console.log("Received thumbs up count...", minusCount.toNumber());

        setMinus(minusCount.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected()
    getCounts()
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          The Crypto Rater
        </div>

        <div className="bio">
          My name's Kevin and I'll be collecting your votes on how you feel about crypto. We'll start with just ETH and I'll continually add more options for you to vote on. Connect your wallet and place some votes!
        <div className="eth">
          How do you feel about ETH?
        </div>
        <div className="eth">
          Total thumbs up: {plusCount} Total thumbs down: {minusCount}
        </div>
        </div>
        <div className="btnContainer">
          <button className="button" onClick={plus}>
            👍
          </button>

          <button className="button" onClick={minus}>
            👎
          </button>
        </div>
        {!currentAccount && (
          <button className="button" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
