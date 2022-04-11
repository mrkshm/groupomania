const voteLogic = (uservote: number, value: number) => {
  if (uservote === 0 && value === 0) {
    console.log("Vous avez trouvé un bug. Veuillez le signaler à l'admin svp.");
    return;
  } else if (uservote === 1 && value === 1) {
    return { uservoteLocal: 0, change: -1 };
  } else if (uservote === -1 && value === -1) {
    return { uservoteLocal: 0, change: 1 };
  } else if (uservote === 0 && value === 1) {
    return { uservoteLocal: 1, change: 1 };
  } else if (uservote === 0 && value === -1) {
    return { uservoteLocal: -1, change: -1 };
  } else if (uservote === 1 && value === -1) {
    return { uservoteLocal: -1, change: -2 };
  } else if (uservote === -1 && value === 1) {
    return { uservoteLocal: 1, change: 2 };
  }
};

export default voteLogic;
