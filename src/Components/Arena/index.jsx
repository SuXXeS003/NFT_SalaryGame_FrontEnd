import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import './Arena.css';
import LoadingIndicator from '../LoadingIndicator';
import StateProgressBar from '../StateProgressbar';

const Arena = ({ characterNFT, setCharacterNFT }) => {
  const [gameContract, setGameContract] = useState(null);
  const [boss, setBoss] = useState(null);

  const [attackState, setAttackState] = useState('');
  const [showToast, setShowToast] = useState(false);

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState('requesting');
        console.log('Request raise...');
        const attackTxn = await gameContract.requestSalaryIncrease();
        await attackTxn.wait();
        console.log('attackTxn:', attackTxn);
        setAttackState('hit');

        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error attacking boss:', error);
      setAttackState('');
    }
  };

  const runReviveAction = async () => {
    try {
      if (gameContract) {
        console.log('Request revive...');
        const reviveTxn = await gameContract.reviveCharacter();
        await reviveTxn.wait();
        console.log('reviveTxn:', reviveTxn);

        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error reviving player:', error);
    }
  };

  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log('Boss:', bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };

    const onAttackComplete = (newBossHp, newPlayerHp, newPlayerXp) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();
      const playerXp = newPlayerXp.toNumber();

      console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

      setBoss((prevState) => {
        return { ...prevState, hp: bossHp };
      });


      setCharacterNFT((prevState) => {
        return {
          ...prevState,
          hp: playerHp,
          xp: playerXp
        };
      });
    };

    const onPlayerDead = (sender, timestamp, tokenId) => {
      console.log("Deathtime:::", new Date(timestamp.toNumber()));

    };

    if (gameContract) {
      fetchBoss();
      gameContract.on('AttackComplete', onAttackComplete);
      gameContract.on('PlayerDead', onPlayerDead);
    }

    return () => {
      if (gameContract) {
        gameContract.off('AttackComplete', onAttackComplete);
        gameContract.off('PlayerDead', onPlayerDead);
      }
    }
  }, [gameContract]);


  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  return (
    <div className="arena-container">
      {characterNFT && (
        <div className="players-container">
          <div className="player-content">
            <div className="player">
              <div className="image-content">
                <h2>{characterNFT.name}</h2>
                <img
                  src={characterNFT.imageURI}
                  alt={`Character ${characterNFT.name}`}
                />
                <div className="health-bar">
                  <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                  <p>{`${characterNFT.hp} / ${characterNFT.maxHp} Arguments`}</p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="active-players">
          <h2>Active Players</h2>
          <div className="players-list">{renderActivePlayersList()}</div>
        </div> */}
        </div>
      )}
      <div className="middle-container">
        <button className="cta-button" onClick={runAttackAction}>
          💥 Raise your salary!
        </button>
        <button className="cta-button" onClick={runReviveAction}>
          Revive!
        </button>
        {attackState === 'requesting' && (
          <div className="loading-indicator">
            <LoadingIndicator />
            <p>Attacking ⚔️</p>
          </div>
        )}
      </div>
      {boss && characterNFT && (
        <div id="toast" className={showToast ? 'show' : ''}>
          <div id="desc">{`💥 ${boss.name} was requested to raise salaries with ${characterNFT.attack} persuasion!`}</div>
        </div>
      )}
      {boss && (
        <div className="boss-container">
          <div className={`boss-content ${attackState}`}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className="image-content">
              <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} Ignorance`}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Arena;