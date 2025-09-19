import { useState } from 'react';
import { Character } from '../data/types';

interface CharacterCreationProps {
  onComplete: (character: Character) => void;
}

const classes: { [key: string]: Omit<Character, 'name'> } = {
  Fighter: {
      skill: 9,
      stamina: 20,
      luck: 10,
      specialAbility: "Add +1 to all damage rolls",
      inventory: ["Longsword", "Chainmail", "Shield", "Bundle of torches"],
      description: "Mighty fighter with strength to overcome obstacles",
      type: 'Fighter',
      currentSkill: 9,
      currentStamina: 20,
      currentLuck: 10
  },
  Rogue: {
      skill: 8,
      stamina: 16,
      luck: 12,
      specialAbility: "Reroll one failed LUCK test per adventure",
      inventory: ["Two daggers", "Leather armour", "Bundle of torches"],
      description: "Crafty rogue with guile to grab treasure and escape",
      type: 'Rogue',
      currentSkill: 8,
      currentStamina: 16,
      currentLuck: 12
  },
  Wizard: {
      skill: 7,
      stamina: 14,
      luck: 11,
      specialAbility: "Cast one spell per adventure (FIREBALL, HEALING, or CONFUSION)",
      inventory: ["Spellbook", "Wand", "Bundle of torches"],
      description: "Wise wizard with intelligence to best dungeon perils",
      type: 'Wizard',
      currentSkill: 7,
      currentStamina: 14,
      currentLuck: 11
  }
};

export const CharacterCreation = ({ onComplete }: CharacterCreationProps) => {
  const [step, setStep] = useState<'class' | 'name' | 'review'>('class');
  const [character, setCharacter] = useState<Omit<Character, 'name'> & { name?: string }>(classes.Fighter);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);

  const rollForClass = () => {
    // Animate dice roll
    const rolls = [1, 2, 3, 4, 5, 6];
    let i = 0;
    const interval = setInterval(() => {
      setDiceRoll(rolls[i % rolls.length]);
      i++;
      if (i > 10) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceRoll(finalRoll);
        
        let selectedClass: keyof typeof classes = 'Fighter';
        if (finalRoll <= 2) selectedClass = 'Fighter';
        else if (finalRoll <= 4) selectedClass = 'Rogue';
        else selectedClass = 'Wizard';
        
        setCharacter(prev => ({
          ...prev,
          ...classes[selectedClass]
        }));
      }
    }, 100);
  };

  const handleClassSelect = (charClass: keyof typeof classes) => {
    setCharacter(prev => ({
      ...prev,
      ...classes[charClass]
    }));
    setStep('name');
  };

  const handleNameSubmit = (name: string) => {
    setCharacter(prev => ({ ...prev, name }));
    setStep('review');
  };

  const startAdventure = () => {
    if (character.name) {
      onComplete({
        ...character,
        currentSkill: character.skill,
        currentStamina: character.stamina,
        currentLuck: character.luck
      } as Character);
    }
  };

  if (step === 'class') {
    return (
      <div className="creation-step">
        <h2>Choose Your Class</h2>
        <div className="dice-roll">
          <button onClick={rollForClass}>Roll for Class (1d6)</button>
          {diceRoll && <div className="die">{diceRoll}</div>}
          <div className="dice-results">
            1-2: Fighter | 3-4: Rogue | 5-6: Wizard
          </div>
        </div>
        <div className="class-options">
          {Object.entries(classes).map(([key, data]) => (
            <div 
              key={key}
              className={`class-option ${character.type === key ? 'selected' : ''}`}
              onClick={() => handleClassSelect(key as keyof typeof classes)}
            >
              <h3>{key}</h3>
              <p>{data.description}</p>
              <div className="stats">
                <span>SKILL: {data.skill}</span>
                <span>STAMINA: {data.stamina}</span>
                <span>LUCK: {data.luck}</span>
              </div>
              <div className="special">Special: {data.specialAbility}</div>
            </div>
          ))}
        </div>
        <button 
          className="continue-button"
          onClick={() => setStep('name')}
          disabled={!character.type}
        >
          Continue
        </button>
      </div>
    );
  }

  if (step === 'name') {
    return (
      <div className="creation-step">
        <h2>Name Your Character</h2>
        <div className="character-preview">
          <div className={`class-badge ${character.type.toLowerCase()}`}>
            {character.type}
          </div>
          <input
            type="text"
            value={character.name || ''}
            onChange={(e) => setCharacter(p => ({ ...p, name: e.target.value }))}
            placeholder="Enter your name"
          />
        </div>
        <div className="buttons">
          <button onClick={() => setStep('class')}>Back</button>
          <button 
            onClick={() => handleNameSubmit(character.name || 'Adventurer')}
            disabled={!character.name}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="creation-step">
      <h2>Review Your Character</h2>
      <div className="character-sheet">
        <h3>{character.name}</h3>
        <p className="class">{character.type}</p>
        
        <div className="stats">
          <div>
            <span>SKILL:</span> {character.skill}
          </div>
          <div>
            <span>STAMINA:</span> {character.stamina}
          </div>
          <div>
            <span>LUCK:</span> {character.luck}
          </div>
        </div>
        
        <div className="special">
          <h4>Special Ability:</h4>
          <p>{character.specialAbility}</p>
        </div>
        
        <div className="equipment">
          <h4>Starting Equipment:</h4>
          <ul>
            {classes[character.type].inventory!.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="buttons">
        <button onClick={() => setStep('name')}>Back</button>
        <button onClick={startAdventure}>Begin Adventure</button>
      </div>
    </div>
  );
};