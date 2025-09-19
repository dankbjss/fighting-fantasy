import { ICharacter } from '../characters';
import { AbilityName } from '../characters/ability';

export const POTION_NAME = {
  SKILL: 'Potion of Skill',
  STAMINA: 'Potion of Strength',
  LUCK: 'Potion of Fortune',
} as const;

export type PotionName = (typeof POTION_NAME)[keyof typeof POTION_NAME];

export interface IPotion {
  name: PotionName;
  type: AbilityName;
  used: boolean;
  drink: (character: ICharacter) => void;
}

export class Potion implements IPotion {
  name: PotionName;
  type: AbilityName;
  used: boolean;

  constructor(type: AbilityName) {
    this.name = POTION_NAME[type];
    this.type = type;
    this.used = false;
  }

  drink(character: ICharacter): void {
    if (this.used) {
      return; // Already used
    }

    switch (this.type) {
      case 'SKILL':
        character.skill.current = character.skill.maximum;
        break;
      case 'STAMINA':
        character.stamina.current = character.stamina.maximum;
        break;
      case 'LUCK':
        character.luck.maximum++;
        character.luck.current = character.luck.maximum;
        break;
    }

    this.used = true; // Mark potion as used
  }
}
