import { Character } from '../characters/character';
import { Monster } from '../characters/monster';
import { Roll } from '../dice-box';
import { Damage, DamageContext } from './damage';

export type Continue = 'continue' | 'characterDefeated' | 'monsterDefeated';

export class Combat {
  character: Character;
  monsters: Monster[];
  special: string;
  public log: string[]; // Logs the rolls and results of each round
  currentRound: number; // Tracks the current round of combat
  currentMonster: Monster | null; // Tracks the current monster being fought

  constructor(character: Character, monsters: Monster[], special: string) {
    this.character = character;
    this.monsters = monsters;
    this.special = special;
    this.log = [];
    this.currentRound = 0;
    this.currentMonster = null;
  }

  public begin(asGroup: boolean = false): void {
    this.log.push(
      `Combat begins! ${this.monsters.length} monsters: ${this.monsters.map(m => m.name).join(', ')}`,
    );

    if (asGroup) {
      // Handle as single entity with combined stats
      // Implementation depends on game rules
    } else {
      // Fight each monster in sequence
      this.currentMonster = this.monsters[this.monsters.length - 1];
    }
  }

  /**
   * Begins a new round of combat.
   */
  public beginRound(): void {
    if (!this.currentMonster) {
      return this.endCombat();
    }

    this.currentRound++;
    this.log.push(`--- Round ${this.currentRound} ---`);
    this.log.push(`You are fighting: ${this.currentMonster.name}`);
  }

  /**
   * Rolls attack strengths for the character and the current monster.
   * @returns An object containing the attack strengths.
   */
  public rollAttacks(): { characterAttack: Roll; monsterAttack: Roll } {
    if (!this.currentMonster) {
      throw new Error('No monster to fight.');
    }

    const characterAttack = this.character.skill.rollAttackStrength();
    const monsterAttack = this.currentMonster.skill.rollAttackStrength();
    this.log.push(
      `${this.character.name}'s Attack Strength: ${characterAttack} vs ${this.currentMonster.name}'s Attack Strength: ${monsterAttack}`,
    );

    return { characterAttack, monsterAttack };
  }

  /**
   * Determines the winner of the round based on attack strengths.
   * @param characterAttack - The character's attack strength.
   * @param monsterAttack - The monster's attack strength.
   * @returns A string indicating the winner ('character', 'monster', or 'draw').
   */
  public determineRoundWinner(
    characterAttack: Roll,
    monsterAttack: Roll,
  ): 'character' | 'monster' | 'draw' {
    if (characterAttack.total > monsterAttack.total) {
      return 'character';
    } else if (characterAttack.total < monsterAttack.total) {
      return 'monster';
    } else {
      return 'draw';
    }
  }

  /**
   * Deals damage to the monster.
   */
  public dealDamage(): void {
    if (!this.currentMonster) {
      throw new Error('No monster to fight.');
    }

    this.log.push(`You wounded ${this.currentMonster.name}!`);
    this.currentMonster.stamina.adjust(-2);
  }

  /**
   * Takes damage from the monster.
   */
  public takeDamage(): void {
    this.log.push(`${this.currentMonster?.name} wounded you!`);
    this.character.stamina.adjust(-2);
  }

  /**
   * Allows the player to test their luck during combat.
   * @param context - The context of the luck test ('damage' or 'defense').
   */
  public testLuck(context: DamageContext): void {
    const luckRoll = this.character.luck.testLuck();

    this.log.push(
      `Testing Luck: Rolled ${luckRoll.total} - ${luckRoll.lucky ? 'Lucky' : 'Unlucky'}`,
    );

    if (context === 'DEAL') {
      this.dealLuckDamage(luckRoll.lucky);
    } else if (context === 'TAKE') {
      this.takeLuckDamage(luckRoll.lucky);
    }
  }

  private dealLuckDamage(lucky: boolean) {
    if (lucky && this.currentMonster) {
    this.log.push(
      `You inflicted a severe wound on ${this.currentMonster.name}!`,
    );
    this.currentMonster.stamina.adjust(
      new Damage('DEAL', 'LUCKY').modifier,
    ); // Additional damage
    } else if(!lucky && this.currentMonster) {
      this.log.push(`Your attack grazed ${this.currentMonster.name}.`);
      this.currentMonster.stamina.adjust(
        new Damage('DEAL', 'UNLUCKY').modifier,
      ); // Restore 1 stamina to the monster
    }
  }

  private takeLuckDamage(lucky: boolean) {
    if (lucky) {
      this.log.push('You minimized the damage!');
      this.character.stamina.adjust(
        new Damage('TAKE', 'LUCKY').modifier
      ); // Reduce damage taken
    } else {
      this.log.push('You took a more serious wound!');
      this.character.stamina.adjust(
        new Damage('TAKE', 'UNLUCKY').modifier
      ); // Additional damage taken
    }
  }

  /**
   * Assesses the stamina of the combatants to determine if the round should 
   * continue.
   * @returns A string indicating the status ('continue', 'characterDefeated',
   * or 'monsterDefeated').
   */
  public assessStamina(): Continue {
    if (this.character.stamina.current <= 0) {
      this.log.push('You have been defeated!');
      return 'characterDefeated';
    }

    if (this.currentMonster && this.currentMonster.stamina.current <= 0) {
      this.log.push(`${this.currentMonster.name} has been defeated!`);
      this.monsters.pop(); // Correctly remove the defeated monster

      if (this.monsters.length > 0) {
        this.currentMonster = this.monsters[this.monsters.length - 1];
        return 'continue';
      } else {
        return 'monsterDefeated';
      }
    }

    return 'continue';
  }

  /**
   * Ends the combat sequence.
   */
  public endCombat(): void {
    this.log.push('Combat has ended.');
    this.currentMonster = null;
  }

  public executeRound(
    useLuckOnAttack: boolean = false,
    useLuckOnDefense: boolean = false,
  ): 'continue' | 'characterDefeated' | 'monsterDefeated' {
    this.beginRound();

    const { characterAttack, monsterAttack } = this.rollAttacks();
    const winner = this.determineRoundWinner(characterAttack, monsterAttack);

    if (winner === 'character') {
      this.dealDamage();
      if (useLuckOnAttack) {
        this.testLuck('DEAL');
      }
    } else if (winner === 'monster') {
      this.takeDamage();
      if (useLuckOnDefense) {
        this.testLuck('TAKE');
      }
    } else {
      this.log.push("You and the monster avoided each other's blows!");
    }

    return this.assessStamina();
  }
}
