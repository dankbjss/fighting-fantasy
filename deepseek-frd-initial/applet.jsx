import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AdventureGame = () => {
  const [character, setCharacter] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [wallTemperament, setWallTemperament] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [notes, setNotes] = useState('');
  const [showSheet, setShowSheet] = useState(false);
  const [combatState, setCombatState] = useState(null);
  const [rollResult, setRollResult] = useState(null);
  const navigate = useNavigate();

  // Adventure nodes data parsed from the markdown
  const adventureNodes = {
    '1': {
      id: '1',
      title: 'The Dungeon Entrance',
      content: 'Having travelled many miles over treacherous terrain, you come finally to the site of the fabled dungeon. Carved into the south side of Mt. Bryntor you see a smooth rectangle, 6 foot high and 2 foot wide. You might call it a door save for the fact it lacks a feature vital to all portals: a handle, or any other means of opening it.',
      choices: [
        { text: 'Go back home', nextNodeId: '73' },
        { text: 'Investigate the area', nextNodeId: '42' }
      ]
    },
    '42': {
      id: '42',
      title: 'The Entrance Puzzle',
      content: 'Taking a moment to survey the area, a patch of stone of a lighter grey than the rest of the mountain catches your eye just off to the left. Three raised buttons adorn the top of the light grey slab, each with a different symbol carved into it: the first trees, the second waves, and the last clouds. Beneath the drawings are carved these words: "The world was formed of three parts. Choose the order in which the parts came to be to reveal the entrance."',
      choices: [
        { text: 'Press clouds, then waves, then trees', nextNodeId: '20' },
        { text: 'Press clouds, then trees, then waves', nextNodeId: '22' },
        { text: 'Press waves, then clouds, then trees', nextNodeId: '40' },
        { text: 'Press waves, then trees, then clouds', nextNodeId: '85' },
        { text: 'Press trees, then clouds, then waves', nextNodeId: '6' },
        { text: 'Press trees, then waves, then clouds', nextNodeId: '36' }
      ]
    },
    '20': {
      id: '20',
      title: 'Correct Sequence!',
      content: 'You press the buttons in sequence: first clouds, then waves, and finally trees. As your finger leaves the final button, you hear a deep rumbling sound. The mountain itself seems to shudder. You hold your breath, watching as the smooth rectangle in the mountainside slowly begins to move. With the grinding of stone against stone, the door slides sideways, revealing a dark tunnel that descends beneath the mountain.',
      choices: [
        { text: 'Descend into the dungeon', nextNodeId: '41' },
        { text: 'Go back home', nextNodeId: '73' }
      ]
    },
    // More nodes would be added here...
    '73': {
      id: '73',
      title: 'Game Over',
      content: 'For many a year will tale be told of how you gave up on your epic quest, never to fulfill your destiny.',
      choices: [
        { text: 'Start over', nextNodeId: '1', action: 'reset' }
      ]
    }
  };

  // Initialize character
  useEffect(() => {
    if (!character) {
      // Default to Wizard for demo purposes
      const defaultChar = {
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

  // Handle node navigation
  const navigateToNode = (nodeId, wallEffect = 0) => {
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

  // Handle combat
  const startCombat = (enemy) => {
    setCombatState({
      enemy,
      round: 1,
      battleLog: [`The battle begins against ${enemy.name}...`]
    });
  };

  const resolveCombatRound = () => {
    if (!combatState || !character) return;

    // Player attack
    const playerRoll = rollDice(2);
    const playerAttack = playerRoll.total + character.currentSkill;

    // Enemy attack
    const enemyRoll = rollDice(2);
    const enemyAttack = enemyRoll.total + combatState.enemy.skill;

    let newLog = [...combatState.battleLog];
    let newEnemy = { ...combatState.enemy };
    let newCharacter = { ...character };

    if (playerAttack > enemyAttack) {
      newEnemy.currentStamina -= 2;
      newLog.push(`You hit the ${combatState.enemy.name} for 2 damage!`);
    } else if (enemyAttack > playerAttack) {
      newCharacter.currentStamina -= 2;
      newLog.push(`The ${combatState.enemy.name} hits you for 2 damage!`);
    } else {
      newLog.push(`You and the ${combatState.enemy.name} avoid each other's blows!`);
    }

    // Check for combat end
    if (newEnemy.currentStamina <= 0) {
      newLog.push(`You defeated the ${combatState.enemy.name}!`);
      setCombatState(null);
      setCharacter(newCharacter);
      // Here you would navigate to the victory node
      return;
    }

    if (newCharacter.currentStamina <= 0) {
      newLog.push(`You have been defeated by the ${combatState.enemy.name}!`);
      setCombatState(null);
      setCharacter(newCharacter);
      // Here you would navigate to the game over node
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

  // Dice rolling function
  const rollDice = (count, sides = 6) => {
    let total = 0;
    const rolls = [];
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }
    const result = { rolls, total };
    setRollResult(result);
    return result;
  };

  // Test luck function
  const testLuck = () => {
    if (!character) return { isLucky: false };

    const roll = rollDice(2);
    const isLucky = roll.total <= character.currentLuck;
    
    // Update luck score
    setCharacter(prev => ({
      ...prev,
      currentLuck: Math.max(0, prev.currentLuck - 1)
    }));

    return { isLucky, roll };
  };

  // Use item function
  const useItem = (item) => {
    if (item === 'Potion of Healing') {
      setCharacter(prev => ({
        ...prev,
        currentStamina: Math.min(prev.stamina, prev.currentStamina + 4)
      }));
      setInventory(prev => prev.filter(i => i !== item));
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
      />
    );
  }

  return (
    <div className="adventure-app">
      {/* Background texture */}
      <div className="paper-texture"></div>
      
      {/* Main content */}
      <div className="adventure-content">
        <header className="adventure-header">
          <h1>The Five Room Dungeon</h1>
          <p>A Fighting Fantasy Adventure</p>
        </header>

        <main className="adventure-node">
          <div className="node-number">Section {currentNode.id}</div>
          {currentNode.title && <h2>{currentNode.title}</h2>}
          <div className="node-content" dangerouslySetInnerHTML={{ __html: currentNode.content }} />
          
          <div className="choices-container">
            <h3>What will you do?</h3>
            <div className="choices-list">
              {currentNode.choices.map((choice, index) => (
                <button
                  key={index}
                  className="choice-button"
                  onClick={() => navigateToNode(choice.nextNodeId, choice.wallEffect || 0)}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </main>

        {/* Dice roller floating button */}
        <button className="dice-button" onClick={() => rollDice(2)}>
          Roll 2d6
        </button>

        {/* Adventure sheet toggle */}
        <button className="sheet-toggle" onClick={() => setShowSheet(!showSheet)}>
          {showSheet ? 'Hide Sheet' : 'Show Sheet'}
        </button>

        {/* Adventure sheet overlay */}
        {showSheet && (
          <div className="adventure-sheet">
            <button className="close-sheet" onClick={() => setShowSheet(false)}>×</button>
            <h2>Adventure Sheet</h2>
            
            <div className="character-info">
              <h3>{character.name}</h3>
              <p>{character.type}</p>
              
              <div className="character-stats">
                <div>
                  <span>SKILL:</span> {character.currentSkill}/{character.skill}
                </div>
                <div>
                  <span>STAMINA:</span> {character.currentStamina}/{character.stamina}
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
                        <button onClick={() => useItem(item)}>Use</button>
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
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Record important information here..."
              />
            </div>
          </div>
        )}

        {/* Dice roll result popup */}
        {rollResult && (
          <div className="dice-result-popup">
            <div className="dice-result">
              <p>Rolled: {rollResult.rolls.join(' + ')} = {rollResult.total}</p>
              <button onClick={() => setRollResult(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CombatView = ({ character, combatState, onAttack, onFlee }) => {
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
                <div 
                  style={{ width: `${(character.currentStamina / character.stamina) * 100}%` }}
                />
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
                <div 
                  style={{ width: `${(combatState.enemy.currentStamina / combatState.enemy.stamina) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {combatState.playerRoll && (
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
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
      
      <div className="combat-actions">
        <button onClick={onAttack}>Attack</button>
        <button onClick={onFlee}>Flee</button>
        {inventory.includes('Potion of Healing') && (
          <button onClick={() => useItem('Potion of Healing')}>Use Potion</button>
        )}
      </div>
    </div>
  );
};

// CSS styles for the pen & paper aesthetic
const styles = `
  .adventure-app {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Courier New', monospace;
    color: #333;
    background-color: #f8f4e8;
    border: 1px solid #d1c7b7;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }

  .paper-texture {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f8f4e8"/><path d="M0 0 L100 0 L100 100 L0 100 Z" stroke="%23d1c7b7" stroke-width="1" fill="none"/><path d="M0 20 L100 20 M0 40 L100 40 M0 60 L100 60 M0 80 L100 80 M20 0 L20 100 M40 0 L40 100 M60 0 L60 100 M80 0 L80 100" stroke="%23e5ddd0" stroke-width="0.5"/></svg>');
    opacity: 0.6;
    pointer-events: none;
    z-index: 0;
  }

  .adventure-content {
    position: relative;
    z-index: 1;
  }

  .adventure-header {
    text-align: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
  }

  .adventure-header h1 {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }

  .adventure-header p {
    font-style: italic;
    margin: 5px 0 0;
  }

  .adventure-node {
    background-color: rgba(255,255,255,0.7);
    padding: 15px;
    border: 1px solid #d1c7b7;
    border-radius: 3px;
    margin-bottom: 20px;
  }

  .node-number {
    font-size: 12px;
    color: #666;
    margin-bottom: 5px;
  }

  .node-content {
    line-height: 1.5;
    margin-bottom: 15px;
  }

  .choices-container h3 {
    font-size: 16px;
    margin-bottom: 10px;
    border-bottom: 1px solid #d1c7b7;
    padding-bottom: 5px;
  }

  .choices-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .choice-button {
    background-color: #fff;
    border: 1px solid #333;
    padding: 8px 12px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    position: relative;
  }

  .choice-button:hover {
    background-color: #f0e6d2;
  }

  .choice-button:after {
    content: "→";
    position: absolute;
    right: 10px;
  }

  .dice-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }

  .sheet-toggle {
    position: fixed;
    bottom: 90px;
    right: 20px;
    background-color: #333;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }

  .adventure-sheet {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    background-color: #f8f4e8;
    padding: 20px;
    border: 2px solid #333;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    z-index: 100;
  }

  .close-sheet {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }

  .adventure-sheet h2 {
    text-align: center;
    margin-bottom: 15px;
    border-bottom: 2px solid #333;
    padding-bottom: 5px;
  }

  .character-info {
    margin-bottom: 15px;
  }

  .character-info h3 {
    margin: 0;
    font-size: 18px;
  }

  .character-info p {
    margin: 0 0 10px;
    font-style: italic;
  }

  .character-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 15px;
  }

  .character-stats div {
    display: flex;
    justify-content: space-between;
  }

  .character-stats span {
    font-weight: bold;
  }

  .special-ability {
    background-color: rgba(255,255,255,0.7);
    padding: 10px;
    border: 1px solid #d1c7b7;
    border-radius: 3px;
  }

  .special-ability h4 {
    margin: 0 0 5px;
  }

  .inventory {
    margin-bottom: 15px;
  }

  .inventory h3 {
    margin: 0 0 10px;
    border-bottom: 1px solid #d1c7b7;
    padding-bottom: 3px;
  }

  .inventory ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .inventory li {
    padding: 5px 0;
    border-bottom: 1px dotted #d1c7b7;
    display: flex;
    justify-content: space-between;
  }

  .inventory button {
    background-color: #333;
    color: white;
    border: none;
    padding: 2px 8px;
    font-size: 12px;
    cursor: pointer;
  }

  .notes textarea {
    width: 100%;
    height: 100px;
    padding: 8px;
    border: 1px solid #d1c7b7;
    background-color: rgba(255,255,255,0.7);
    font-family: inherit;
  }

  .dice-result-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .dice-result {
    background-color: #f8f4e8;
    padding: 20px;
    border: 2px solid #333;
    text-align: center;
  }

  .dice-result button {
    margin-top: 10px;
    background-color: #333;
    color: white;
    border: none;
    padding: 5px 15px;
    cursor: pointer;
  }

  /* Combat view styles */
  .combat-view {
    background-color: rgba(255,255,255,0.7);
    padding: 15px;
    border: 1px solid #d1c7b7;
    border-radius: 3px;
  }

  .combatants {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .combatant {
    width: 48%;
    padding: 10px;
    border: 1px solid #d1c7b7;
    background-color: rgba(255,255,255,0.5);
  }

  .combatant.player {
    border-color: #4a6ea9;
    background-color: rgba(74, 110, 169, 0.1);
  }

  .combatant.enemy {
    border-color: #a94a4a;
    background-color: rgba(169, 74, 74, 0.1);
  }

  .stamina-bar {
    height: 5px;
    background-color: #e0e0e0;
    margin-top: 3px;
  }

  .stamina-bar div {
    height: 100%;
    background-color: #4caf50;
  }

  .enemy .stamina-bar div {
    background-color: #f44336;
  }

  .attack-results {
    margin: 15px 0;
    padding: 10px;
    background-color: rgba(255,255,255,0.5);
    border: 1px solid #d1c7b7;
  }

  .attack-roll {
    margin: 5px 0;
  }

  .battle-log {
    max-height: 150px;
    overflow-y: auto;
    padding: 10px;
    background-color: rgba(255,255,255,0.5);
    border: 1px solid #d1c7b7;
    margin-bottom: 15px;
  }

  .battle-log ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .battle-log li {
    padding: 3px 0;
    border-bottom: 1px dotted #d1c7b7;
  }

  .combat-actions {
    display: flex;
    gap: 10px;
  }

  .combat-actions button {
    flex: 1;
    padding: 8px;
    background-color: #333;
    color: white;
    border: none;
    cursor: pointer;
  }
`;

// Add styles to the document
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);

export default AdventureGame;