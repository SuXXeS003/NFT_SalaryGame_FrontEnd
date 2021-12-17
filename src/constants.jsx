const CONTRACT_ADDRESS = '0x883ab984941830DFe2b24e3F8E44E3a3C8EFE710';

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