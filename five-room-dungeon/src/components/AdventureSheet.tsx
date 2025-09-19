import { Character } from '../data/types';

interface AdventureSheetProps {
  character: Character;
  wallTemperament: number;
  inventory: string[];
  notes: string;
  onUseItem: (item: string) => void;
  onNotesChange: (notes: string) => void;
  onClose: () => void;
}

export const AdventureSheet = ({
  character,
  wallTemperament,
  inventory,
  notes,
  onUseItem,
  onNotesChange,
  onClose
}: AdventureSheetProps) => {
  return (
    <div className="adventure-sheet">
      <button className="close-sheet" onClick={onClose}>×</button>
      <h2>Adventure Sheet</h2>
      
      <div className="character-info">
        <h3>{character.name}</h3>
        <p className="character-class">{character.type}</p>
        
        <div className="character-stats">
          <div>
            <span>SKILL:</span> {character.currentSkill}/{character.skill}
          </div>
          <div>
            <span>STAMINA:</span> {character.currentStamina}/{character.stamina}
            <div className="stamina-bar">
              <div style={{ 
                width: `${(character.currentStamina / character.stamina) * 100}%` 
              }} />
            </div>
          </div>
          <div>
            <span>LUCK:</span> {character.currentLuck}/{character.luck}
          </div>
          <div>
            <span>WALL TEMP:</span> {wallTemperament}
          </div>
        </div>
        
        <div className="special-ability">
          <h4>Special Ability:</h4>
          <p>{character.specialAbility}</p>
          {character.type === 'Wizard' && (
            <p>Spells remaining: {character.spellsRemaining}</p>
          )}
        </div>
      </div>
      
      <div className="inventory">
        <h3>Equipment & Items</h3>
        {inventory.length > 0 ? (
          <ul>
            {inventory.map((item, index) => (
              <li key={index}>
                {item}
                {item === 'Potion of Healing' && (
                  <button onClick={() => onUseItem(item)}>Use</button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>You carry no special items yet.</p>
        )}
      </div>
      
      <div className="notes">
        <h3>Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Record important information here..."
        />
      </div>
    </div>
  );
};