import { Dice } from '../dice-box';
import { Ability } from './ability';

/**
 * Stamina is a measure of your health. It is used to determine the
 * outcome of certain events in the game.
 *
 * The higher your STAMINA score, the more health you have.
 * Adjusts the current value of the stamina.
 * @param amount - amount to adjust the current value by
 */
export class Stamina extends Ability {
  constructor(dice: Dice = new Dice(6, 2, 12)) {
    super('STAMINA', dice);
  }
}
