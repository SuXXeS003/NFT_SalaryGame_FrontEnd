import React from 'react';
import './ActivePlayerList.css';

const ActivePlayerList = (props) => {
  return (
    <div className="active-players">
        <h2>Active Players</h2>
        <div className="players-list">{props.ActivePlayers}</div>
    </div>
  );
};

export default ActivePlayerList;