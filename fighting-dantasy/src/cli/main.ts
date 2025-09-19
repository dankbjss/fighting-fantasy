import { Character, Skill, Stamina, Luck, Monster } from '../characters';
import { Inventory } from '../inventory';
import { Combat, Continue } from '../combat';
import { Logger } from './logger';
import { InputService, createBunReadlineInterface } from './input-service';

/**
 * Main game class that handles the flow of the game
 */
export class Main {
  private logger: Logger;
  private inputService: InputService;

  /**
   * Create a new Main instance
   * @param logger Logger instance for output
   * @param inputService InputService instance for user input
   */
  constructor(
    logger = new Logger(),
    inputService = new InputService(createBunReadlineInterface())
  ) {
    this.logger = logger;
    this.inputService = inputService;
  }

  /**
   * Create a character with user input
   * @param useRandomStats Whether to use random stats
   * @returns The created character
   */
  private async createCharacter(useRandomStats: boolean = true): Promise<Character> {
    const name = await this.inputService.askQuestion('Enter your character name: ');

    // Create base abilities
    const skill = new Skill();
    const stamina = new Stamina();
    const luck = new Luck();

    if (!useRandomStats) {
      // Let user define stats
      const skillValue = await this.inputService.askNumber('Enter your SKILL (7-12): ');
      const staminaValue = await this.inputService.askNumber('Enter your STAMINA (14-24): ');
      const luckValue = await this.inputService.askNumber('Enter your LUCK (7-12): ');

      skill.current = skillValue;
      skill.maximum = skillValue;
      stamina.current = staminaValue;
      stamina.maximum = staminaValue;
      luck.current = luckValue;
      luck.maximum = luckValue;
    }

    // Show initial stats
    this.logger.logCharacterCreation(name, skill.current, stamina.current, luck.current);

    // Create inventory and select potion
    const inventory = new Inventory();

    const potionChoice = await this.inputService.askQuestion(
      '\nChoose a potion (skill/stamina/luck): '
    );
    switch (potionChoice.toLowerCase()) {
      case 'skill':
        inventory.potion = 'SKILL';
        break;
      case 'stamina':
        inventory.potion = 'STAMINA';
        break;
      case 'luck':
        inventory.potion = 'LUCK';
        break;
      default:
        this.logger.log('Invalid choice, no potion selected.');
    }

    return new Character(name, skill, stamina, luck, inventory);
  }

  /**
   * Create a monster with user input
   * @returns The created monster
   */
  private async createMonster(): Promise<Monster> {
    const name = await this.inputService.askQuestion('Enter monster name: ');
    const skill = await this.inputService.askNumber('Enter monster SKILL: ');
    const stamina = await this.inputService.askNumber('Enter monster STAMINA: ');

    return new Monster(name, skill, stamina);
  }

  /**
   * Handle a combat round
   * @param combat The combat instance
   * @param character The player character
   * @returns The status after the round
   */
  private async handleCombatRound(
    combat: Combat,
    character: Character
  ): Promise<Continue> {
    const currentMonster = combat.currentMonster!;
    
    combat.beginRound();
    this.logger.logRoundBegin(combat.currentRound);
    this.logger.logStats(
      character,
      currentMonster,
    );

    // Roll for attack strengths
    const { characterAttack, monsterAttack } = combat.rollAttacks();
    this.logger.logRolls(
      characterAttack.dice,
      character.skill.current,
      characterAttack.total,
      monsterAttack.dice,
      currentMonster.skill.current,
      monsterAttack.total
    );

    // Determine winner
    const winner = combat.determineRoundWinner(characterAttack, monsterAttack);
    let status: Continue = 'continue';

    if (winner === 'character') {
      status = await this.handleCharacterHit(combat);
    } else if (winner === 'monster') {
      status = await this.handleMonsterHit(combat, character);
    } else {
      this.logger.logDraw();
    }

    // Display updated stats
    this.logger.logStats(
      character,
      currentMonster,
    );

    // Check if the fight continues
    status = combat.assessStamina();

    // Handle potion and escape options if combat continues
    if (status === 'continue') {
      status = await this.handleCombatOptions(combat, character);
    }

    // Handle next monster if current one is defeated
    if (status === 'monsterDefeated' && combat.monsters.length > 0) {
      status = await this.handleNextMonster(combat);
    }

    await this.inputService.askQuestion('\nPress Enter to continue...');
    return status;
  }

  /**
   * Handle the case where the character hits the monster
   * @param combat The combat instance
   * @param character The player character
   * @returns The status after the hit
   */
  private async handleCharacterHit(
    combat: Combat,
  ): Promise<Continue> {
    const currentMonster = combat.currentMonster!;
    this.logger.logCharacterHit(currentMonster.name);
    combat.dealDamage();

    if (currentMonster.stamina.current <= 0) {
      this.logger.logMonsterDefeated(currentMonster.name);
      return 'monsterDefeated';
    }

    // Ask if player wants to use luck for extra damage
    const useLuck = await this.inputService.askYesNo('Test your LUCK for extra damage?');
    if (useLuck) {
      const luck = combat.character.luck.testLuck();
      if (luck.lucky) {
        combat.dealDamage(); // Extra damage
        
        if (currentMonster.stamina.current <= 0) {
          this.logger.logMonsterDefeated(currentMonster.name);
          return 'monsterDefeated';
        }
      }
    }
    
    return 'continue';
  }

  /**
   * Handle the case where the monster hits the character
   * @param combat The combat instance
   * @param character The player character
   * @returns The status after the hit
   */
  private async handleMonsterHit(
    combat: Combat,
    character: Character
  ): Promise<Continue> {
    const currentMonster = combat.currentMonster!;
    this.logger.logMonsterHit(currentMonster.name);
    combat.takeDamage();

    if (character.stamina.current <= 0) {
      this.logger.logCharacterDefeated();
      return 'characterDefeated';
    }

    // Ask if player wants to use luck to reduce damage
    const useLuck = await this.inputService.askYesNo('Test your LUCK to reduce damage?');
    if (useLuck) {
      combat.testLuck('TAKE');

      if (character.stamina.current <= 0) {
        this.logger.logCharacterDefeated();
        return 'characterDefeated';
      }
    }
    
    return 'continue';
  }

  /**
   * Handle combat options (potion, escape)
   * @param combat The combat instance
   * @param character The player character
   * @returns The status after handling options
   */
  private async handleCombatOptions(
    combat: Combat,
    character: Character
  ): Promise<Continue> {
    // Option to use potion
    if (
      combat.character.inventory.potion &&
      !combat.character.inventory.potion.used
    ) {
      const potionName = character.inventory.potion?.name ?? 'potion';
      const usePotion = await this.inputService.askYesNo(`\nDrink your ${potionName}?`);
      if (usePotion) {
        character.inventory.potion?.drink(character);
        this.logger.logPotionDrink(potionName);
      }
    }

    // Option to escape
    const escape = await this.inputService.askYesNo('\nDo you want to escape?');
    if (escape) {
      return await this.handleEscape(combat, character);
    }
    
    return 'continue';
  }

  /**
   * Handle escaping from combat
   * @param combat The combat instance
   * @param character The player character
   * @returns The status after escaping
   */
  private async handleEscape(
    combat: Combat,
    character: Character
  ): Promise<Continue> {
    // Store monster name before ending combat
    const monsterName = combat.currentMonster!.name;
    this.logger.logEscape(monsterName, character.stamina.current);
    character.stamina.adjust(-2);
    
    // Option to test luck when escaping
    const testLuckOnEscape = await this.inputService.askYesNo('Test your LUCK to reduce escape damage?');
    if (testLuckOnEscape) {
      combat.testLuck('TAKE');
      this.logger.logEscapeLuck(character.stamina.current);
    }
    
    combat.endCombat();
    this.logger.logEscapeSuccess(monsterName, character.stamina.current);
    
    return 'continue';
  }

  /**
   * Handle transitioning to the next monster
   * @param combat The combat instance
   * @returns The status after transitioning
   */
  private async handleNextMonster(combat: Combat): Promise<Continue> {
    const previousMonsterName = combat.currentMonster!.name;
    this.logger.log(`\n${previousMonsterName} has been defeated!`);
    combat.monsters.pop(); // Remove the defeated monster
    
    if (combat.monsters.length > 0) {
      combat.currentMonster = combat.monsters[combat.monsters.length - 1];
      this.logger.logNextMonster(combat.currentMonster.name);
      return 'continue';
    }
    
    return 'monsterDefeated';
  }

  /**
   * Run a full combat encounter
   * @param character The player character
   * @param monsters Array of monsters to fight
   */
  private async runCombat(
    character: Character,
    monsters: Monster[]
  ): Promise<void> {
    const specialRule = await this.inputService.askQuestion(
      'Enter any special combat rules (or press Enter for none): '
    );
    const combat = new Combat(character, monsters, specialRule || 'None');

    this.logger.logCombatBegin();
    combat.begin();

    let status: Continue = 'continue';

    while (status === 'continue' && combat.currentMonster) {
      status = await this.handleCombatRound(combat, character);
    }

    // Combat results
    this.handleCombatResults(status, character);
  }

  /**
   * Handle the results of combat
   * @param status The final status of combat
   * @param character The player character
   */
  private handleCombatResults(status: Continue, character: Character): void {
    if (status === 'characterDefeated') {
      this.logger.logDefeat();
    } else if (status === 'monsterDefeated') {
      this.logger.logVictory(
        character.skill.current,
        character.stamina.current,
        character.luck.current
      );
    }
  }

  /**
   * Run the game
   */
  public async run(): Promise<void> {
    try {
      this.logger.logHeader();

      // Create the player character
      const useRandomStats = await this.inputService.askYesNo('Use random stats?');
      const character = await this.createCharacter(useRandomStats);

      // Create monsters
      const monsters: Monster[] = [];
      let addAnotherMonster = true;

      while (addAnotherMonster) {
        monsters.push(await this.createMonster());
        addAnotherMonster = await this.inputService.askYesNo('Add another monster?');
      }

      // Reverse the array so we can use pop() to get the current monster
      monsters.reverse();

      // Run the combat
      await this.runCombat(character, monsters);

      this.logger.logFooter();
    } catch (error) {
      this.logger.error('An error occurred:', error as Error);
    } finally {
      this.inputService.close();
    }
  }
}

// Create a file to run the application
if (require.main === module) {
  const game = new Main();
  game.run().catch((error) => console.error('Fatal error:', error));
}