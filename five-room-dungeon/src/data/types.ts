export interface NodeEffect {
    character?: Partial<Character>;
    inventory?: string[];
    wallTemperament?: number;
  }
  
  export interface AdventureNode {
    id: string;
    title: string;
    content: string;
    choices: {
      text: string;
      nextNodeId: string;
      wallEffect?: number;
      action?: 'startCombat' | 'testLuck' | 'useItem' | 'reset';
      enemy?: Enemy;
      condition?: (character: Character) => boolean;
    }[];
    effect?: (character: Character, inventory: string[]) => NodeEffect;
  }
  
  export interface Character {
    name: string;
    type: 'Fighter' | 'Rogue' | 'Wizard';
    skill: number;
    stamina: number;
    luck: number;
    currentSkill: number;
    currentStamina: number;
    currentLuck: number;
    specialAbility: string;
    spellsRemaining?: number;
    inventory?: string[];
    description?: string;
  }
  
  export interface Enemy {
    name: string;
    skill: number;
    stamina: number;
    currentStamina: number;
  }
  
  export interface CombatState {
    enemy: Enemy;
    round: number;
    battleLog: { message: string; type?: string }[];
    playerRoll?: { rolls: number[]; total: number };
    enemyRoll?: { rolls: number[]; total: number };
  }
  
  export interface DiceRoll {
    rolls: number[];
    total: number;
  }