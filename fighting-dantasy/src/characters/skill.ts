import { Dice, Roll } from '../dice-box';
import { Ability } from './ability';

/**
 * Skill is a measure of your ability to fight. It is used to determine the
 * outcome of combat in the game.
 *
 * The higher your SKILL score, the better you are at fighting.
 */
export class Skill extends Ability {
  constructor(dice: Dice = new Dice(6, 1, 6)) {
    super('SKILL', dice);
  }
  /**
   * Return an attack roll of 2d6 + (this.current + modifiers)
   *
   * @param modifiers - optional modifiers to add to the roll.
   * @returns {Roll} - the result of the attack.
   */
  rollAttackStrength(modifiers?: number): Roll {
    return new Dice(6, 2, this.current + (modifiers || 0)).roll();
  }
}
