import React from 'react';
import './PlayerCard.css';

const PlayerCard = (props) => {
  return (
    <div className="players-container">
        <div className="player-content">
            <div className="player">
            <div className="image-content">
                <h2>{props.name}</h2>
                <img
                src={props.imageURI}
                alt={`Character ${props.name}`}
                />
                <div className="health-bar">
                <progress value={props.hp} max={props.maxHp} />
                <p>{`${props.hp} / ${props.maxHp} Arguments`}</p>
                </div>
            </div>
            </div>
        </div>
        
    </div>
  );
};

export default PlayerCard;