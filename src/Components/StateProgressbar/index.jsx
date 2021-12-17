import React from "react";

const StateProgressBar = (props) => {
  const characterNFT = props.characterNFT;

  const containerStyles = {
    height: 10,
    width: '100px',
    backgroundColor: "lightgrey",
    color: "black",
    fontWeight: "bold",
    fontSize: "8px"
  }

  const healthStyles = {
    height: '100%',
    width: `${characterNFT.hp}%`,
    backgroundColor: "red",
    borderRadius: 'inherit',
    transition: 'width 1s ease-in-out',
    textAlign: 'right'
  }

  const xpStyles = {
    height: '100%',
    width: `${characterNFT.xp}%`,
    backgroundColor: "green",
    borderRadius: 'inherit',
    transition: 'width 1s ease-in-out',
    textAlign: 'right'
  }


  return (

    <div>
        <div className="progressContainer" style={containerStyles}>
          <div className="fillerContainer" style={healthStyles}>
            <span role="progressbar"
              aria-valuenow={`${characterNFT.hp}`}
              aria-valuemin="0"
              aria-valuemax={`${characterNFT.maxHp}`}>{`${characterNFT.hp}%`}</span>
          </div>
        </div>
        <div className="progressContainer" style={containerStyles}>
          <div className="fillerContainer" style={xpStyles}>
            <span role="progressbar"
              aria-valuenow={`${characterNFT.xp}`}
              aria-valuemin="0"
              aria-valuemax={`${characterNFT.maxXp}`}>{`${characterNFT.xp}%`}</span>
          </div>
        </div>
    </div>
  );
};

export default StateProgressBar;