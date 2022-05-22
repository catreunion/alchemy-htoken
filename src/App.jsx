import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import alchemylogo from "./alchemylogo.svg"
import abi from "./HToken.json"
import "./App.css"

const App = () => {
  const [hasMetamask, setHasMetamask] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [myAddr, setMyAddr] = useState("")
  const [recipientAddr, setRecipientAddr] = useState("")
  const contractAddress = "0x7f2C4072861A4d8E41809BaF1459361b3C28387B"
  const contractABI = abi.abi
  const [balance, setBalance] = useState(0)
  // const [amount, setAmount] = useState(0)

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true)
    }
  }, [])

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const [account] = await window.ethereum.request({ method: "eth_requestAccounts" })
        setMyAddr(account)
        setIsConnected(true)
        checkBalance()
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please install MetaMask")
    }
  }

  const checkBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const [account] = await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contractInstance = new ethers.Contract(contractAddress, contractABI, provider)
        setBalance((await contractInstance.balanceOf(account)).toString())
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please install MetaMask")
    }
  }

  const sendETH = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer)
        const tx = await contractInstance.transfer(recipientAddr, 100)
        await tx.wait()
        checkBalance()
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please install MetaMask")
    }
  }

  return (
    <div className="App">
      <div id="container">
        <img id="logo" src={alchemylogo} alt=""></img>
        <button id="walletButton" onClick={connectWallet}>
          {hasMetamask ? (isConnected ? "Connected " + String(myAddr).substring(0, 6) + "..." + String(myAddr).substring(38) : "Connect MetaMask") : "Please install MetaMask"}
        </button>

        <h2 style={{ paddingTop: "50px" }}>My Balance in Hardhat Token :</h2>
        <p>{balance}</p>

        <h2 style={{ paddingTop: "18px" }}>Recipient Wallet Address :</h2>
        <div>
          <input type="text" placeholder="Send 100 Hardhat Token" onChange={(e) => setRecipientAddr(e.target.value)} value={recipientAddr} />
        </div>

        <button id="publish" onClick={checkBalance}>
          Check Balance
        </button>
        <button id="publish" onClick={sendETH}>
          Send 100 Hardhat Token
        </button>
      </div>
    </div>
  )
}

export default App
