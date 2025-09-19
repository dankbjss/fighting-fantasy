export interface IRoll {
  dice: number[];
  sum: number;
  total: number;
  modifier?: number;
}

/**
 * Roll class represents the result of a dice roll.
 *
 * @param {number[]} dice - The rolled dice values.
 * @param {number} sum - The sum of the rolled values.
 * @param {number} total - The total value after applying modifiers.
 *
 */
export class Roll implements IRoll {
  _dice: number[];
  _sum: number;
  _total: number;

  constructor(dice: number[], sum: number, total: number) {
    this._dice = dice;
    this._sum = sum;
    this._total = total;
  }

  get dice(): number[] {
    return this._dice;
  }
  get sum(): number {
    return this._sum;
  }
  get total(): number {
    return this._total;
  }
}
