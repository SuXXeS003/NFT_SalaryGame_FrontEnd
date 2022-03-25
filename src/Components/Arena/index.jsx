import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import './Arena.css';
import LoadingIndicator from '../utils/LoadingIndicator';
import BossCard from '../Cards/BossCard';
import PlayerCard from '../Cards/PlayerCard';
import StdButton from '../utils/Button';
import Toast from '../utils/Toast';

const Arena = ({ characterNFT, setCharacterNFT }) => {
  const [gameContract, setGameContract] = useState(null);
  const [boss, setBoss] = useState(null);

  const [attackState, setAttackState] = useState('');
  const [show, setShow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = () => {
    setShow(true);
  };

  const hideToast = () => {
    setShow(false);
  };

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState('requesting');
        console.log('Request raise...');
        const attackTxn = await gameContract.requestSalaryIncrease();
        await attackTxn.wait();
        console.log('attackTxn:', attackTxn);
        setAttackState('hit');

        setToastMessage('You have successfully attacked the boss!');
        showToast();
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

        setToastMessage('You have successfully revived your character!');
        showToast();
      }
    } catch (error) {
      console.error('Error reviving player:', error);
    }
  };

  const viewToast = async () => {
    setToastMessage("Only view purpose!");
    showToast();
  }

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

    const onPlayerRevived = (newPlayerHp) => {
      const playerHp = newPlayerHp.toNumber();

      console.log(`ReviceComplete: Player Hp: ${playerHp}`);

      setCharacterNFT((prevState) => {
        return {
          ...prevState,
          hp: playerHp,
        };
      });
    };

    const onPlayerDead = (timestamp) => {
      console.log("Deathtime:::", new Date(timestamp.toNumber()*1000));
    };

    if (gameContract) {
      fetchBoss();
      gameContract.on('AttackComplete', onAttackComplete);
      gameContract.on('PlayerDead', onPlayerDead);
      gameContract.on('PlayerRevived', onPlayerRevived);
    }

    return () => {
      if (gameContract) {
        gameContract.off('AttackComplete', onAttackComplete);
        gameContract.off('PlayerDead', onPlayerDead);
        gameContract.off('PlayerRevived', onPlayerRevived);
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
    <div>
      <div className="arena-container">
        {characterNFT && (
          <PlayerCard player={characterNFT} />
        )}
        <div className="middle-container">
          <StdButton btnColor='red' type="rounded" labelColor='black' onClick={runAttackAction}>Raise your salary!</StdButton>
          <StdButton btnColor='red' type="rounded" labelColor='black' onClick={runReviveAction}>Revive!</StdButton>
          <StdButton btnColor='red' type="rounded" labelColor='black' onClick={viewToast}>TOAST!</StdButton>
          {attackState === 'requesting' && (
            <div className="loading-indicator">
              <LoadingIndicator />
              <p>Attacking </p>
            </div>
          )}
        </div>
        {boss && (
          <BossCard boss={boss} attackState={attackState}/>
        )}
        <div id="toast">
          {boss && characterNFT && (
            <Toast show={show} hideToast={hideToast} message={toastMessage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Arena;