import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { MetroSpinner } from "react-spinners-kit";
import contractAbi from "./utils/contractAbi.json";

// Constants
const TWITTER_HANDLE = "thekideveloper";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "https://testnets.opensea.io/collection/freshmannft-v4";
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const contractAddress = "0xafC0B89F15868Bcc7757Db6aD0254e017E642355";
  const [account, setAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mintCount, setMintCount] = useState(0);
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
        setLoading(true);

        console.log("Mining...please wait.");
        await txn.wait();

        setLoading(false);
        NFTContract.on("newNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId.toNumber()}>`
          );
        });
      } else {
        console.log("Couldn't find the ethereum object");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getMintCount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        const totalNumberOfNFTsMintedFromContract =
          await contract.getTotalNFTsMintedSoFar();

        setMintCount(parseInt(totalNumberOfNFTsMintedFromContract._hex));
      } else {
        console.log("The ethereum object is not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  getMintCount();

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );
  const renderViewCollectionContainer = () => (
    <button
      className="cta-button opensea-button"
      onClick={() => {
        window.open(OPENSEA_LINK);
      }}
    >
      View Collection on Opensea
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
          {renderViewCollectionContainer()}
          <br />
          {account !== "" ? (
            <>
              <button
                onClick={mintNFT}
                className="cta-button connect-wallet-button"
              >
                Mint NFT
              </button>
              <div className="spinner">
                <MetroSpinner
                  size={40}
                  frontColor="blue"
                  backColor="white"
                  loading={loading}
                />
              </div>
            </>
          ) : correctNetwork ? (
            renderNotConnectedContainer()
          ) : (
            <div className="change-network-prompt">
              Change network to Goerli
            </div>
          )}
          <p className="mint-count">
            {mintCount} / {TOTAL_MINT_COUNT} NFTs Minted
          </p>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
