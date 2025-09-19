import { Roll } from './roll';

interface IDice {
  faces: number;
  number: number;
  modifier?: number;
}

/**
 * Dice class represents a number of dice to be rolled with optional modifiers,
 * and provides methods to roll the dice and get the results.
 *
 * @param {number} faces - The number of faces on the dice.
 * @param {number} number - The number of times to roll the dice.
 * @param {number} modifier - An optional modifier to add to the total.
 * @method roll - Rolls the dice and returns a Roll object containing the rolled values, sum, and total.
 */

export class Dice implements IDice {
  _faces: number;
  _number: number;
  _modifier?: number;

  constructor(faces: number, number: number, modifier?: number) {
    this._faces = faces;
    this._number = number;
    this._modifier = modifier;
  }

  get faces(): number {
    return this._faces;
  }
  get number(): number {
    return this._number;
  }
  get modifier(): number | undefined {
    return this._modifier;
  }

  /**
   *
   * @returns {number} - A random number between 1 and the number of faces on the dice.
   */
  private rollDie(): number {
    return Math.floor(Math.random() * this.faces) + 1;
  }

  /**
   * Rolls the dice a specified number of times and returns an array of the rolled values.
   *
   * @returns {number[]} - An array of rolled values.
   */
  private rollDice(): number[] {
    const dice: number[] = [];
    for (let i = 0; i < this.number; i++) {
      dice.push(this.rollDie());
    }
    return dice;
  }

  /**
   * Rolls the dice and returns a Roll object containing the rolled values, sum, and total.
   *
   * @returns {Roll} - A Roll object containing the rolled values, sum, and total.
   */
  roll(): Roll {
    const dice = this.rollDice();
    const sum = dice.reduce((acc, val) => acc + val, 0);
    const total = this._modifier ? sum + this._modifier : sum;

    return new Roll(dice, sum, total);
  }
}
