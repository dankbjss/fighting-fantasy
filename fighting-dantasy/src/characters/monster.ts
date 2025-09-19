import { Dice, Roll } from '../dice-box';
import { Skill } from './skill';
import { Stamina } from './stamina';

interface IMonster {
  name: string;
  skill: Skill;
  stamina: Stamina;
}

export class Monster implements IMonster {
  private _name: string;
  private _skill: Skill;
  private _stamina: Stamina;

  constructor(name: string, skillMax: number, staminaMax: number) {
    this._name = name;
    this._skill = new Skill();
    this._stamina = new Stamina();

    this._skill.maximum = skillMax;
    this._skill.current = skillMax;
    this.skill.dice = new Dice(6, 2, this.skill.current);

    this._stamina.maximum = staminaMax;
    this._stamina.current = staminaMax;
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

  rollAttackStrength(): Roll {
    return this.skill.rollAttackStrength();
  }
}
