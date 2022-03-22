import React, { useEffect, useState } from 'react';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import myEpicGame from './utils/MyEpicGame.json';
import { ethers } from 'ethers';
import Home from './Components/Home';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/utils/LoadingIndicator';
//import StateProgressBar from './Components/StateProgressbar';


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
    Array.from(document.querySelectorAll('.link.active')).forEach(function(el) { 
      el.classList.remove('active');
    });
    if (!currentAccount) {      
      return (
        <div className="connect-wallet-container">
          <p> Please connect your wallet to get started. </p>
          <p> You will become able to mint your own NFT. </p>
          <br />
          <button
            className="cta-button connect-wallet-button" onClick={connectWalletAction}
          >
            Connect
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      let el = document.getElementById("home");
      el.classList.add('active');
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT && target === "/") {
      let el = document.getElementById("home");
      el.classList.add('active');
      return <Home />;
    } else if (currentAccount && characterNFT && target === "/arena") {
      let el = document.getElementById("arena");
      el.classList.add('active');
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT && target === "/work") {
      let el = document.getElementById("work");
      el.classList.add('active');
      return "WORK";
    } else {
      return <Home />;
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
    <div>
      <div className="header">
      <nav className="navigation">
         <ul>
            <li><a id="home" className="link" href="/">Home</a></li>
            <li>
              <a>Arena</a>
              <ul className="drop-menu">
                <li><a id="arena" className="link" href="arena">Boss1</a></li>
                <li><a id="arena" className="link" href="Boss1">Boss2</a></li>
                <li><a id="arena" className="link" href="Boss2">Boss3</a></li>
              </ul>
              </li>
            <li><a id="work" className="link" href="work">Work</a></li>
         </ul> 
      </nav>
   </div>
        <div className='content'>
            <div className="sidebar">
                  
            </div>
            <div className="mainContent">
             {renderContent()}
            </div>
      </div>
    </div>
  );
};

export default App;
