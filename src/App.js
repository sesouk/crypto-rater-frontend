import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const plus = () => {
    
  }

  const minus = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
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
      </div>
    </div>
  );
}
