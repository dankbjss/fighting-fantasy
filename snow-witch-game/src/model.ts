export interface Character {
    skill: number;
    stamina: number;
    luck: number;
    initialSkill: number;
    initialStamina: number;
    initialLuck: number;
    provisions: number;
    gold: number;
    inventory: string[];
  }
  
export interface Enemy {
    name: string;
    skill: number;
    stamina: number;
  }