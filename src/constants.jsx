const CONTRACT_ADDRESS = '0x3ABF66Bd4A87b75AD61950EB8F30e0238e86F554';

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