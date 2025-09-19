import { Luck } from './luck';
import { Stamina } from './stamina';
import { Skill } from './skill';
import { Inventory } from '../inventory';

export interface ICharacter {
  name: string;
  skill: Skill;
  stamina: Stamina;
  luck: Luck;
  inventory: Inventory;
}

export class Character implements ICharacter {
  _name: string;
  _skill: Skill;
  _stamina: Stamina;
  _luck: Luck;
  _inventory: Inventory;

  constructor(
    name: string,
    skill: Skill,
    stamina: Stamina,
    luck: Luck,
    inventory: Inventory,
  ) {
    this._name = name;
    this._skill = skill;
    this._stamina = stamina;
    this._luck = luck;
    this._inventory = inventory;
  }

  get name(): string {
    return this._name;
  }

  get skill(): Skill {
    return this._skill;
  }

  get stamina(): Stamina {
    return this._stamina;
  }

  get luck(): Luck {
    return this._luck;
  }

  get inventory(): Inventory {
    return this._inventory;
  }

  set inventory(inventory: Inventory) {
    this._inventory = inventory;
  }

  eatProvisions(): void {
    if (this._inventory.provisions > 0) {
      this._stamina.adjust(4);
      this._inventory.provisions -= 1;
    } else {
      throw new Error('No provisions left to eat.');
    }
  }
}
