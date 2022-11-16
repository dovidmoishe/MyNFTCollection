import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractAbi from "./utils/contractAbi.json";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const contractAddress = "0xA455f0aF731681B6a03095701b5E98BD3eB17F67";
  const [account, setAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);
  // Render Methods
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object");
    }

    let chain_id = await ethereum.request({ method: "eth_chainId" });

    const goerli_chainId = "0x5";

    if (chain_id !== goerli_chainId) {
      alert("Connect to Goerli chain");
      return;
    } else {
      setCorrectNetwork(true);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Install metamask");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length !== 0) {
        const account = accounts[0];
        setAccount(account);
        console.log(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const mintNFT = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const NFTContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        const txn = await NFTContract.makeAnNFT();

        console.log("Mining...please wait.");
        await txn.wait();

        console.log(
          `Mined, see transaction: https://goerli.etherscan.io/tx/${txn.hash}`
        );
      } else {
        console.log("Couldn't find the ethereum object");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">NFT Collection</p>
          <p className="sub-text">Get your NFT ticket now!</p>
          {account !== "" ? (
            <button
              onClick={mintNFT}
              className="cta-button connect-wallet-button"
            >
              Mint NFT
            </button>
          ) : correctNetwork ? (
            renderNotConnectedContainer()
          ) : (
            <div>Change network to Goerli</div>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
