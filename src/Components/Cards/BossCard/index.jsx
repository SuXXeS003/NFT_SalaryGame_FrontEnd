import React from 'react';
import './BossCard.css';

const BossCard = (props) => {
  return (
    <div className="boss-container">
      <div className={`boss-content ${props.attackState}`}>
        <h2>{props.boss.name}</h2>
        <div className="image-content">
          <img src={props.boss.imageURI} alt={`Boss ${props.boss.name}`} />
          <div className="health-bar">
            <progress value={props.boss.hp} max={props.boss.maxHp} />
            <p>{`${props.boss.hp} / ${props.boss.maxHp} Ignorance`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BossCard;