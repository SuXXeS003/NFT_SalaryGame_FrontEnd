const CONTRACT_ADDRESS = '0xb72af2da3E0B3F6aE8E9209DEec8a2cB961028b1';

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp,
    maxHp: characterData.maxHp,
    attack: characterData.attack.toNumber(),
    lifeState: characterData.lifestate,
    xp: characterData.experience,
    maxXp: characterData.maxExperience,
    level: characterData.level,
    jobDesc: characterData.jobDescription,
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };