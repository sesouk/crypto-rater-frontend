import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/CryptoRater.json'

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("")
  const [allRatings, setRates] = useState([])
  const [text, setText] = useState("")
  const [plusCount, setPlus] = useState("")
  const [minusCount, setMinus] = useState("")
  const [mining, setMining] = useState("")

  const contractAddress = "0x5E87b342a263C15ddCc7e80320Dc78a642057e41"

  const contractABI = abi.abi

  const getAllRatings = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const cryptoRateContract = new ethers.Contract(contractAddress, contractABI, signer)

        const rates = await cryptoRateContract.getAllRatings()

        let ratesCleaned = []
        rates.forEach(rate => {
          ratesCleaned.push({
            address: rate.rater,
            timestamp: new Date(rate.timestamp * 1000),
            message: rate.message
          })
        })

        setRates(ratesCleaned)

        cryptoRateContract.on("NewRate", (from, timestamp, message) => {
          console.log("NewRate", from, timestamp, message);

          setRates(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
          }])
        })
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window

      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const cryptoRateContract = new ethers.Contract(contractAddress, contractABI, signer)

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

        getAllRatings()

        let plusCount = await cryptoRateContract.getPlus()
        console.log("Received thumbs up count...", plusCount.toNumber());

        let minusCount = await cryptoRateContract.getMinus()
        console.log("Received thumbs down count...", minusCount.toNumber());
  
        setPlus(plusCount.toNumber())
        setMinus(minusCount.toNumber())
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

  const plus = async () => {
    try {
      const { ethereum } = window
      
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const cryptoRateContract = new ethers.Contract(contractAddress, contractABI, signer)

        let plusCount = await cryptoRateContract.getPlus()
        console.log("Received thumbs up count...", plusCount.toNumber());

        const plusTxn = await cryptoRateContract.plus(text, { gasLimit: 300000 })
        console.log("Mining...", plusTxn.hash);
        setMining(true)

        await plusTxn.wait()
        console.log("Mined -- ", plusTxn.hash);
        setMining(false)

        plusCount = await cryptoRateContract.getPlus()
        console.log("Received thumbs up count...", plusCount.toNumber());

        setPlus(plusCount.toNumber())
        setText("")
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

        const minusTxn = await cryptoRateContract.minus(text, { gasLimit: 300000 })
        console.log("Mining...", minusTxn.hash);
        setMining(true)

        await minusTxn.wait()
        console.log("Mined -- ", minusTxn.hash);
        setMining(false)

        minusCount = await cryptoRateContract.getMinus()
        console.log("Received thumbs down count...", minusCount.toNumber());

        setMinus(minusCount.toNumber())
        setText("")
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (e) => {
    setText(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
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
          Hi! My name is Kevin and this is my first dApp built with Solidity, React, JavaScript, and Hardhat. I'm collecting your votes on how you feel about Ethereum. Connect your MetaMask wallet and place some votes! You will need some test ether on the Rinkeby testnet to use this dApp. If you're lucky you may even win some test eth!
        {mining &&
          (
            <div className="eth" style={{color: "red"}}>
              Mining...
            </div>
          )
        }
        {currentAccount &&
          (
            <div className="eth">
              Total thumbs up: {plusCount} Total thumbs down: {minusCount}
            </div>
          )
        }
        </div>
        <textarea 
          style={{height: "3rem"}} 
          placeholder="Tell me something you like/dislike about Ethereum? Click the 👍 or 👎 to submit your response!"
          value={text}
          onChange={handleChange}
          >
        </textarea>
        <div className="btnContainer">
          <button className="button" onClick={plus} onSubmit={handleSubmit}>
            👍
          </button>

          <button className="button" onClick={minus} onSubmit={handleSubmit}>
            👎
          </button>
        </div>
        {!currentAccount && (
          <button className="button" onClick={connectWallet}>
            Connect Wallet to Vote
          </button>
        )}
      <div className="container">
        {allRatings.map((rate, i) => {
          return (
            <div key={i} className="msgContainer">
              <div>Address: {rate.address}</div>
              <div>Time: {rate.timestamp.toString()}</div>
              <div>Message: {rate.message}</div>
            </div>
          )
        })}
      </div>
      </div>
    </div>
  );
}
