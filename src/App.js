import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("")

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

  const plus = () => {
    
  }

  const minus = () => {
    
  }

  useEffect(() => {
    checkIfWalletIsConnected()
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
