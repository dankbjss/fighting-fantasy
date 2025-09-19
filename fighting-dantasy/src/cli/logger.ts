import { Character, Monster } from "../characters";

/**
 * Logger class for handling output in the game
 */
export class Logger {
  /**
   * Log a message to the console
   * @param message The message to log
   */
  public log(message: string): void {
    console.log(message);
  }

  /**
   * Log an error message to the console
   * @param message The error message to log
   */
  public error(message: string, error?: Error): void {
    console.error(message, error ? error : '');
  }

  /**
   * Log character and monster stats
   * @param characterName Character name
   * @param characterSkill Character's skill
   * @param characterStamina Character's stamina
   * @param characterLuck Character's luck
   * @param monsterName Monster name
   * @param monsterSkill Monster's skill
   * @param monsterStamina Monster's stamina
   */
  public logStats(
    character: Character,
    monster: Monster,
  ): void {
    this.log(
      `${monster.name} (SKILL: ${monster.skill}, STAMINA: ${monster.stamina})`,
    );
    this.log(
      `${character.name} (SKILL: ${character.skill}, STAMINA: ${character.stamina}, LUCK: ${character.luck})`,
    );
  }

  /**
   * Log dice roll results
   * @param characterDice Character's dice rolls
   * @param characterSkill Character's skill
   * @param characterTotal Character's total attack strength
   * @param monsterDice Monster's dice rolls
   * @param monsterSkill Monster's skill
   * @param monsterTotal Monster's total attack strength
   */
  public logRolls(
    characterDice: number[],
    characterSkill: number,
    characterTotal: number,
    monsterDice: number[],
    monsterSkill: number,
    monsterTotal: number,
  ): void {
    this.log(
      `\nYou rolled: ${characterDice.join(', ')} + ${characterSkill} = ${characterTotal}`,
    );
    this.log(
      `Monster rolled: ${monsterDice.join(', ')} + ${monsterSkill} = ${monsterTotal}`,
    );
  }

  /**
   * Log the beginning of combat
   */
  public logCombatBegin(): void {
    this.log('\n======= COMBAT BEGINS =======');
  }

  /**
   * Log the beginning of a round
   * @param round Round number
   */
  public logRoundBegin(round: number): void {
    this.log(`\n--- Round ${round} ---`);
  }

  /**
   * Log a character hit
   * @param monsterName Name of the monster being hit
   */
  public logCharacterHit(monsterName: string): void {
    this.log(`\nYou hit ${monsterName}!`);
  }

  /**
   * Log a monster hit
   * @param monsterName Name of the monster hitting
   */
  public logMonsterHit(monsterName: string): void {
    this.log(`\n${monsterName} hit you!`);
  }

  /**
   * Log a draw (no hit)
   */
  public logDraw(): void {
    this.log("\nYou and the monster avoid each other's blows!");
  }

  /**
   * Log monster defeat
   * @param monsterName Name of the defeated monster
   */
  public logMonsterDefeated(monsterName: string): void {
    this.log(`${monsterName} has been defeated!`);
  }

  /**
   * Log character defeat
   */
  public logCharacterDefeated(): void {
    this.log('You have been defeated!');
  }

  /**
   * Log next monster
   * @param monsterName Name of the next monster
   */
  public logNextMonster(monsterName: string): void {
    this.log(`Next opponent: ${monsterName}`);
  }

  /**
   * Log potion consumption
   * @param potionName Name of the potion
   */
  public logPotionDrink(potionName: string): void {
    this.log(`You drank your ${potionName}!`);
  }

  /**
   * Log escape attempt
   * @param monsterName Name of the monster being escaped from
   * @param stamina Character's stamina after escape damage
   */
  public logEscape(monsterName: string, stamina: number): void {
    this.log(`You attempt to escape from ${monsterName}!`);
    this.log(`${monsterName} wounds you as you flee! Your STAMINA: ${stamina}`);
  }

  /**
   * Log escape success
   * @param monsterName Name of the monster escaped from
   * @param stamina Character's stamina
   */
  public logEscapeSuccess(monsterName: string, stamina: number): void {
    this.log('\n====== ESCAPED ======');
    this.log(`You escaped from ${monsterName}! STAMINA: ${stamina}`);
  }

  /**
   * Log stamina after testing luck during escape
   * @param stamina Character's stamina
   */
  public logEscapeLuck(stamina: number): void {
    this.log(`Your STAMINA after testing luck: ${stamina}`);
  }

  /**
   * Log the result of combat (victory)
   * @param skill Character's skill
   * @param stamina Character's stamina
   * @param luck Character's luck
   */
  public logVictory(skill: number, stamina: number, luck: number): void {
    this.log('\n====== VICTORY! ======');
    this.log('All monsters have been defeated!');
    this.log(
      `Final stats - SKILL: ${skill}, STAMINA: ${stamina}, LUCK: ${luck}`,
    );
  }

  /**
   * Log the result of combat (defeat)
   */
  public logDefeat(): void {
    this.log('\n====== YOU HAVE BEEN DEFEATED! ======');
    this.log('Your adventure ends here...');
  }

  /**
   * Log initial character stats
   * @param name Character name
   * @param skill Character's skill
   * @param stamina Character's stamina
   * @param luck Character's luck
   */
  public logCharacterCreation(
    name: string,
    skill: number,
    stamina: number,
    luck: number,
  ): void {
    this.log(`\nYour character: ${name}`);
    this.log(`SKILL: ${skill}`);
    this.log(`STAMINA: ${stamina}`);
    this.log(`LUCK: ${luck}`);
  }

  /**
   * Log the application header
   */
  public logHeader(): void {
    this.log('===== FIGHTING FANTASY COMBAT SIMULATOR =====\n');
  }

  /**
   * Log the application footer
   */
  public logFooter(): void {
    this.log('\nThanks for playing!');
  }
}
