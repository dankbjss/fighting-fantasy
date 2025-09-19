// Updated luck.ts
import { Dice, IRoll } from '../dice-box';
import { Ability } from './ability';

export interface LuckResult extends IRoll {
  lucky: boolean;
  currentLuck: number; // The luck score at the time of testing (before reduction)
}

/**
 * Luck is a measure of your good fortune. It is used to determine the
 * outcome of certain events in the game.
 */
export class Luck extends Ability {
  luckDice: Dice;
  constructor(dice: Dice = new Dice(6, 1, 6)) {
    super('LUCK', dice);
    this.luckDice = new Dice(6, 2); // Two dice for testing luck
  }

  /**
   * Roll two dice. If the number rolled is equal to or less than your
   * current LUCK score, you have been lucky and the result will go in your
   * favour. If the number rolled is higher than your current LUCK score,
   * you have been unlucky and you will be penalized.
   *
   * Each time you Test your Luck, you must subtract one point from your
   * current LUCK score.
   *
   * @param {number} modifiers - optional modifiers to add to the roll
   * @return {LuckResult} - result of the luck roll
   */
  testLuck(modifiers?: number): LuckResult {
    const roll = this.luckDice.roll();
    const currentLuckValue = this.current; // Capture current luck before reduction
    const sum = roll.sum;
    const lucky = sum <= currentLuckValue; // Compare dice sum to current luck

    // Reduce luck after testing
    this.adjust(-1);

    return {
      lucky,
      currentLuck: currentLuckValue,
      total: sum + (modifiers || 0),
      sum: sum,
      dice: roll.dice,
      modifier: modifiers || 0,
    };
  }
}
