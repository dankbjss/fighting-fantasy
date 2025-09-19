  // Roll dice function
export const rollDice = (count = 2) => {
    let total = 0;
    for (let i = 0; i < count; i++) {
      total += Math.floor(Math.random() * 6) + 1;
    }
    return total;
  };