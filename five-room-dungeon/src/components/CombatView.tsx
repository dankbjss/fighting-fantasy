import { Character, CombatState } from '../data/types';

interface CombatViewProps {
  character: Character;
  combatState: CombatState;
  onAttack: () => void;
  onFlee: () => void;
  onUsePotion: () => void;
}

export const CombatView = ({
  character,
  combatState,
  onAttack,
  onFlee,
  onUsePotion
}: CombatViewProps) => {
  return (
    <div className="combat-view">
      <h2>Combat!</h2>
      
      <div className="combatants">
        <div className="combatant player">
          <h3>{character.name}</h3>
          <div className="stats">
            <div>SKILL: {character.currentSkill}</div>
            <div>
              STAMINA: {character.currentStamina}/{character.stamina}
              <div className="stamina-bar">
                <div style={{ 
                  width: `${(character.currentStamina / character.stamina) * 100}%` 
                }} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="combatant enemy">
          <h3>{combatState.enemy.name}</h3>
          <div className="stats">
            <div>SKILL: {combatState.enemy.skill}</div>
            <div>
              STAMINA: {combatState.enemy.currentStamina}/{combatState.enemy.stamina}
              <div className="stamina-bar">
                <div style={{ 
                  width: `${(combatState.enemy.currentStamina / combatState.enemy.stamina) * 100}%` 
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {combatState.playerRoll && combatState.enemyRoll && (
        <div className="attack-results">
          <div className="attack-roll">
            <span>Your Attack:</span>
            {combatState.playerRoll.rolls.join(' + ')} + {character.currentSkill} = {combatState.playerRoll.total + character.currentSkill}
          </div>
          <div className="attack-roll">
            <span>Enemy Attack:</span>
            {combatState.enemyRoll.rolls.join(' + ')} + {combatState.enemy.skill} = {combatState.enemyRoll.total + combatState.enemy.skill}
          </div>
        </div>
      )}
      
      <div className="battle-log">
        <h3>Battle Log:</h3>
        <ul>
          {combatState.battleLog.map((log, index) => (
            <li key={index}>{log.message}</li>
          ))}
        </ul>
      </div>
      
      <div className="combat-actions">
        <button onClick={onAttack}>Attack</button>
        <button onClick={onFlee}>Flee</button>
        {character.currentStamina < character.stamina && (
          <button onClick={onUsePotion}>Use Healing Potion</button>
        )}
      </div>
    </div>
  );
};