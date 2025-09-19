// Updated character.ts
import { AbilityName } from '../characters/ability';
import { IPotion, Potion } from './potion';

export interface IInventory {
  provisions: number;
  potion: IPotion | null;
}

export class Inventory implements IInventory {
  private _provisions: number;
  private _potion: Potion | null;

  constructor() {
    this._provisions = 10;
    this._potion = null;
  }

  get provisions(): number {
    return this._provisions;
  }

  set provisions(value: number) {
    if (value < 0) {
      throw new Error('Provisions cannot be negative');
    }
    this._provisions = value;
  }

  set potion(abilityName: AbilityName | null) {
    this._potion = abilityName ? new Potion(abilityName) : null;
  }

  get potion(): Potion | null {
    return this._potion;
  }
}
