import React from 'react';
import './PlayerCard.css';

const PlayerCard = (props) => {
  return (
    <div className="players-container">
        <div className="player-content">
            <div className="player">
            <div className="image-content">
                <h2>{props.player.name}</h2>
                <img
                src={props.player.imageURI}
                alt={`Character ${props.player.name}`}
                />
                <div className="health-bar">
                <progress value={props.player.hp} max={props.player.maxHp} />
                <p>{`${props.player.hp} / ${props.player.maxHp} Arguments`}</p>
                </div>
            </div>
            </div>
        </div>
        
    </div>
  );
};

export default PlayerCard;