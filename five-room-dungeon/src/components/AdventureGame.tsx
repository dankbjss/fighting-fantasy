import { useState, useEffect } from 'react';
import { AdventureNode, Character, CombatState, Enemy } from '../data/types';
import { adventureNodes } from '../data/nodes';
import { CombatView } from './CombatView';
import { AdventureSheet } from './AdventureSheet';
import { DiceRoller } from './DiceRoller';

export const AdventureGame = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [currentNode, setCurrentNode] = useState<AdventureNode | null>(null);
  const [wallTemperament, setWallTemperament] = useState(0);
  const [inventory, setInventory] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showSheet, setShowSheet] = useState(false);
  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [diceRoll, setDiceRoll] = useState<{ rolls: number[]; total: number } | null>(null);

  // Initialize game
  useEffect(() => {
    if (!character) {
      const defaultChar: Character = {
        name: 'Avalana',
        type: 'Wizard',
        skill: 7,
        stamina: 14,
        luck: 11,
        currentSkill: 7,
        currentStamina: 14,
        currentLuck: 11,
        specialAbility: 'Cast one spell per adventure (FIREBALL, HEALING, or CONFUSION)',
        spellsRemaining: 1
      };
      setCharacter(defaultChar);
      setInventory(['Spellbook', 'Wand', 'Bundle of torches']);
      setCurrentNode(adventureNodes['1']);
    }
  }, [character]);

  const navigateToNode = (nodeId: string, wallEffect = 0) => {
    if (nodeId === 'reset') {
      setCharacter(null);
      setWallTemperament(0);
      setInventory([]);
      setCurrentNode(null);
      return;
    }

    if (wallEffect !== 0) {
      setWallTemperament(prev => Math.max(0, prev + wallEffect));
    }

    const nextNode = adventureNodes[nodeId];
    if (nextNode) {
      setCurrentNode(nextNode);
    } else {
      console.error(`Node ${nodeId} not found`);
      setCurrentNode(adventureNodes['1']);
    }
  };

  const handleChoice = (choice: AdventureNode['choices'][0]) => {
    // Wall temperament logic
    if (choice.wallEffect) {
      setWallTemperament(prev => Math.max(0, prev + choice.wallEffect!));
    }
  
    // Conditional choices (for nodes like node 18 with temperament conditions)
    if (choice.condition && !choice.condition(character!)) {
      return; // Skip this choice if condition isn't met
    }
  
    // Wall temperament-based routing logic for temperament-dependent paths
    if (currentNode?.id === '18') {
      // Choose between nodes 78 and 17 based on temperament
      if (wallTemperament <= 1) {
        navigateToNode('78');
      } else {
        navigateToNode('17');
      }
      return;
    }
  
    // Similar for node 55, 63, etc.
    if (currentNode?.id === '55') {
      if (wallTemperament >= 2) {
        navigateToNode('23');
      } else {
        navigateToNode('30');
      }
      return;
    }
  
    // Standard navigation
    if (choice.action === 'startCombat' && 'enemy' in choice) {
      startCombat(choice.enemy as unknown as Enemy);
    } else if (choice.action === 'reset') {
      navigateToNode('reset');
    } else {
      navigateToNode(choice.nextNodeId);
    }
  };

  const startCombat = (enemy: Enemy) => {
    setCombatState({
      enemy: { ...enemy, currentStamina: enemy.stamina },
      round: 1,
      battleLog: [{ message: `The battle begins against ${enemy.name}...` }]
    });
  };

  const resolveCombatRound = () => {
    if (!combatState || !character) return;

    const playerRoll = rollDice(2);
    const playerAttack = playerRoll.total + character.currentSkill;

    const enemyRoll = rollDice(2);
    const enemyAttack = enemyRoll.total + combatState.enemy.skill;

    let newLog = [...combatState.battleLog];
    let newEnemy = { ...combatState.enemy };
    let newCharacter = { ...character };

    if (playerAttack > enemyAttack) {
      newEnemy.currentStamina -= 2;
      newLog.push({ message: `You hit the ${combatState.enemy.name} for 2 damage!` });
    } else if (enemyAttack > playerAttack) {
      newCharacter.currentStamina -= 2;
      newLog.push({ message: `The ${combatState.enemy.name} hits you for 2 damage!` });
    } else {
      newLog.push({ message: `You and the ${combatState.enemy.name} avoid each other's blows!` });
    }

    // Check for combat end
    if (newEnemy.currentStamina <= 0) {
      newLog.push({ message: `You defeated the ${combatState.enemy.name}!` });
      setCombatState(null);
      setCharacter(newCharacter);
      navigateToNode('13'); // Victory node
      return;
    }

    if (newCharacter.currentStamina <= 0) {
      newLog.push({ message: `You have been defeated by the ${combatState.enemy.name}!` });
      setCombatState(null);
      setCharacter(newCharacter);
      navigateToNode('73'); // Game over
      return;
    }

    setCombatState({
      ...combatState,
      enemy: newEnemy,
      round: combatState.round + 1,
      battleLog: newLog,
      playerRoll,
      enemyRoll
    });
    setCharacter(newCharacter);
  };

  const rollDice = (count: number, sides = 6) => {
    let total = 0;
    const rolls = [];
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }
    const result = { rolls, total };
    setDiceRoll(result);
    return result;
  };

  const useItem = (item: string) => {
    if (item === 'Potion of Healing' && character) {
      setCharacter({
        ...character,
        currentStamina: Math.min(character.stamina, character.currentStamina + 4)
      });
      setInventory(inventory.filter(i => i !== item));
    }
  };

  if (!character || !currentNode) {
    return <div className="loading">Preparing your adventure...</div>;
  }

  if (combatState) {
    return (
      <CombatView
        character={character}
        combatState={combatState}
        onAttack={resolveCombatRound}
        onFlee={() => setCombatState(null)}
        onUsePotion={() => useItem('Potion of Healing')}
      />
    );
  }

  return (
    <div className="adventure-app">
      <div className="paper-texture"></div>
      
      <div className="adventure-content">
        <header className="adventure-header">
          <h1>The Five Room Dungeon</h1>
          <p>A Fighting Fantasy Adventure</p>
        </header>

        <main className="adventure-node">
          <div className="node-number">Section {currentNode.id}</div>
          {currentNode.title && <h2>{currentNode.title}</h2>}
          <div className="node-content">{currentNode.content}</div>
          
          <div className="choices-container">
            <h3>What will you do?</h3>
            <div className="choices-list">
              {currentNode.choices.map((choice, index) => (
                <button
                  key={index}
                  className="choice-button"
                  onClick={() => handleChoice(choice)}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </main>

        <button className="dice-button" onClick={() => setShowDiceRoller(true)}>
          Roll Dice
        </button>

        <button className="sheet-toggle" onClick={() => setShowSheet(!showSheet)}>
          {showSheet ? 'Hide Sheet' : 'Show Sheet'}
        </button>

        {showSheet && (
          <AdventureSheet
            character={character}
            wallTemperament={wallTemperament}
            inventory={inventory}
            notes={notes}
            onUseItem={useItem}
            onNotesChange={setNotes}
            onClose={() => setShowSheet(false)}
          />
        )}

        {showDiceRoller && (
          <DiceRoller 
            onRoll={rollDice} 
            onClose={() => setShowDiceRoller(false)}
            result={diceRoll}
          />
        )}
      </div>
    </div>
  );
};

import { CharacterCreation } from './CharacterCreation';

export const GameWrapper = () => {
  const [character, setCharacter] = useState<Character | null>(null);

  if (!character) {
    return <CharacterCreation onComplete={setCharacter} />;
  }

  return <AdventureGame />;
};