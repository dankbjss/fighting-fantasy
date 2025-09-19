import { Dice, Roll } from '../dice-box';

interface IAbility {
  name: AbilityName;
  dice?: Dice;
  initialRoll?: Roll;
  current: number;
  maximum: number;
}

const ABILITY_NAMES = {
  skill: 'SKILL',
  stamina: 'STAMINA',
  luck: 'LUCK',
} as const;

export type AbilityName = (typeof ABILITY_NAMES)[keyof typeof ABILITY_NAMES];

/**
 * Ability is the measure of a given attribute. It is used to
 * determine the outcome of certain events in the game.
 */
export class Ability implements IAbility {
  _name: AbilityName;
  _dice: Dice;
  _initialRoll: Roll;
  _current: number;
  _maximum: number;

  constructor(name: AbilityName, dice: Dice) {
    this._name = name;
    this._dice = dice;
    this._initialRoll = this._dice.roll();
    this._current = this._initialRoll.total;
    this._maximum = this._initialRoll.total;
  }

  get name(): AbilityName {
    return this._name;
  }

  get initialRoll(): Roll {
    return this._initialRoll;
  }

  get current(): number {
    return this._current;
  }

  set current(current: number) {
    this._current = current;
    this.dice = new Dice(this._dice.faces, this._dice.number, this._current);
  }

  /**
   * Adjusts the current value of the ability to either the maximum or current
   * value + amount, whichever is lower.
   *
   * @param amount - amount to adjust the current value by, negative numbers to deduct
   */
  adjust(amount: number): void {
    this._current = Math.min(this.maximum, this.current + amount);
    this._dice = new Dice(this._dice.faces, this._dice.number, this._current);
  }

  get maximum(): number {
    return this._maximum;
  }

  set maximum(maximum: number) {
    this._maximum = maximum;
  }

  get dice(): Dice {
    return this._dice;
  }

  set dice(dice: Dice) {
    this._dice = dice;
  }
}
