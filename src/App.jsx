import React, { useEffect, useState } from 'react';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import myEpicGame from './utils/MyEpicGame.json';
import { ethers } from 'ethers';
import Home from './Components/Home';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';
import StateProgressBar from './Components/StateProgressbar';


const App = () => {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask");
        setIsLoading(false);
        return;
      } else {
        console.log("We have the ethereum object");
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const networkId = await ethereum.request({ method: 'net_version' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);

          switch (networkId) {
            case "1":
              alert('This is mainnet. Please switch to rinkeby network and reload!')
              return
            case "2":
              alert('This is the deprecated Morden test network. Please switch to rinkeby network and reload!')
              return
            case "3":
              alert('This is the ropsten test network. Please switch to rinkeby network and reload!')
              return
            case "4":
              console.log('This is the rinkeby test network.')
              break;
            case "42":
              alert('This is the kovan test network. Please switch to rinkeby network and reload!')
              return;
            default:
              alert('This is an unknown network. Please switch to rinkeby network and reload!')
              return
          }

        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    const target = window.location.pathname;

    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img src="https://cloudflare-ipfs.com/ipfs/QmetsaWYSqkxxiXPEsC8wyAHtvW9WfQ9EWXNHRjS2r1BmG" />
          <br />
          <button
            className="cta-button connect-wallet-button" onClick={connectWalletAction}
          >
            Connect Wallet to get Started
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT && target == "/") {
      return <Home />
    } else if (currentAccount && characterNFT && target == "/arena") {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
    } else if (currentAccount && characterNFT && target == "/work") {
      return "WORK"
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Get Metamask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();

      if (txn.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log('No character NFT found');
      }

      setIsLoading(false);
    };

    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <section className='myGrid'>
      <div className='header'>
        <ul className="topnav">
          <li><a className="active" href="/">Home</a></li>
          <li><a href="arena">Arena</a></li>
          <li><a href="work">Work</a></li>
        </ul>
        {characterNFT && (
          <StateProgressBar characterNFT={characterNFT} />
        )}
      </div>
      <div className='content'>
        {renderContent()}
      </div>
      <div className='footer'>
      </div>
    </section>
  );
};

export default App;
