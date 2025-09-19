import { useState } from 'react';
import { Character, Enemy } from './model';
import { NodeKey, nodes } from './nodes';
import { rollDice } from './roll-dice';


function SnowWitchGame() {
  const [node, setNode] = useState<NodeKey>('start');
  const [character, setCharacter] = useState<Character>({} as Character);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [theme, setTheme] = useState('light');

  // Create character
  const rollCharacter = () => {
    const skill = rollDice(1) + 6;
    const stamina = rollDice(2) + 12;
    const luck = rollDice(1) + 6;

    setCharacter({
      skill,
      stamina,
      luck,
      initialSkill: skill,
      initialStamina: stamina,
      initialLuck: luck,
      provisions: 10,
      gold: 0,
      inventory: ["Sword", "Backpack"]
    });
  };

  // Test luck
  const testLuck = (successNode: NodeKey, failureNode: NodeKey) => {
    if (!character) return;

    const roll = rollDice(2);
    const isLucky = roll <= character.luck;

    // Reduce luck by 1
    setCharacter({
      ...character,
      luck: character.luck - 1
    });

    // Navigate based on result
    setNode(isLucky ? successNode : failureNode);
  };

  const startCombat = (startingEnemies: Enemy[]) => {
    setEnemies(startingEnemies);
    setCombatLog([]);
  };

  const advanceCombatRound = () => {
    if (!character || enemies.length === 0) return;

    const targetIndex = enemies.findIndex(e => e.stamina > 0);
    if (targetIndex === -1) {
      // All enemies are defeated
      const currentCombatNode = Object.values(nodes).find(
        node => node.enemies === enemies
      );
      const victoryNode = currentCombatNode?.successNode || "node1"; // Fallback to node1 if not specified
      setNode(victoryNode);
      return;
    }

    const target = enemies[targetIndex];
    const playerAttack = rollDice(2) + character.skill;
    const enemyAttack = rollDice(2) + target.skill;
    let log = `You (${playerAttack}) vs ${target.name} (${enemyAttack}): `;

    const newCharacter = { ...character };
    const newEnemies = [...enemies];

    if (playerAttack > enemyAttack) {
      newEnemies[targetIndex].stamina -= 2;
      log += `You hit ${target.name} for 2 damage!`;
    } else if (enemyAttack > playerAttack) {
      newCharacter.stamina -= 2;
      log += `${target.name} hits you for 2 damage!`;
    } else {
      log += "It's a tie. No damage.";
    }

    setCombatLog(prev => [...prev, log]);
    setCharacter(newCharacter);
    setEnemies(newEnemies);

    const allDead = newEnemies.every(e => e.stamina <= 0);
    if (newCharacter.stamina <= 0) {
      setNode("gameOver");
    } else if (allDead) {
      const currentCombatNode = Object.values(nodes).find(
        node => node.enemies === enemies
      );
      const victoryNode = currentCombatNode?.successNode || "node1"; // Fallback to node1 if not specified
      setNode(victoryNode);
    }
  };

  // Handle node actions
  const handleAction = (action: string, successNode?: NodeKey, failureNode?: NodeKey) => {
    switch (action) {
      case 'rollCharacter':
        rollCharacter();
        break;
      case 'testLuck':
        if (successNode && failureNode) {
          testLuck(successNode, failureNode);
        }
        break;
      case 'combat':
        startCombat(nodes[node].enemies || []);
        break;
      default:
        break;
    }
  };

  const handleChoice = (next: NodeKey) => {
    const nextNode = nodes[next];

    // If the next node is combat and has enemies, start combat
    if (nextNode.action === "combat" && nextNode.enemies) {
      startCombat(nextNode.enemies);
      setNode(next)
    } else {
      setNode(next);
    }
  };

  // Current node data with fallback
  const currentNode = nodes[node];

  return (
    <div className={`game ${theme}`}>
      <header>
        <h1>Caverns of the Snow Witch</h1>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <main>
      {character && (
          <div className="character-sheet">
            <h3>Character Sheet</h3>
            <p>SKILL: {character.skill}</p>
            <p>STAMINA: {character.stamina}</p>
            <p>LUCK: {character.luck}</p>
            <p>Provisions: {character.provisions}</p>
          </div>
        )}

        <div className="node-card">
          <h2>{currentNode.title}</h2>
          <p>{currentNode.content}</p>

          {enemies.map((e, i) => (
            <p key={i}>{e.name} — SKILL: {e.skill}, STAMINA: {e.stamina}</p>
          ))}
          <button onClick={advanceCombatRound}>Next Round</button>
          <div className="combat-log">
            <ul>
              {[...combatLog].reverse().map((entry, index) => (
                <li key={combatLog.length - index - 1}>{entry}</li>
              ))}
            </ul>
          </div>

          {'action' in currentNode && currentNode.action && (
            <button
              onClick={() =>
                currentNode.action && handleAction(
                  currentNode.action,
                  currentNode.successNode,
                  currentNode.failureNode
                )
              }
            >
              {currentNode.action === 'rollCharacter' ? 'Roll Character' :
                currentNode.action === 'testLuck' ? 'Test Your Luck' :
                  'Continue'}
            </button>
          )}

          {'choices' in currentNode && currentNode.choices && (
            <div className="choices">
              {currentNode.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(choice.next)}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <style>{`
        .game {
          margin: 0 auto;
          padding: 1.2rem;
          background-color: ${theme === 'light' ? '#f5f5f5' : '#333'};
          color: ${theme === 'light' ? '#333' : '#f5f5f5'};
        }
        header {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.2rem;
          border-bottom: 2px solid ${theme === 'light' ? '#333' : '#f5f5f5'};
          padding-bottom: .8rem;
        }
        .node-card {
          padding: 1.2rem;
          border: 1px solid ${theme === 'light' ? '#ccc' : '#666'};
          margin-bottom: 1.2rem;
          border-radius: .3rem;
          background-color: ${theme === 'light' ? '#fff' : '#444'};
        }
        .choices {
          margin-top: 1.2rem;
        }
        button {
          display: block;
          width: 100%;
          padding: .6rem;
          margin-bottom: .6rem;
          background-color: ${theme === 'light' ? '#3a405a' : '#aec5eb'};
          color: ${theme === 'light' ? '#fff' : '#333'};
          border: none;
          border-radius: .3rem;
          cursor: pointer;
          text-align: center;
        }
        .character-sheet {
          padding: 1.3rem;
          border: 1px solid ${theme === 'light' ? '#ccc' : '#666'};
          border-radius: .3rem;
          background-color: ${theme === 'light' ? '#fff' : '#444'};
        }
        .combat-log {
          height: 200px; /* Set a fixed height */
          overflow-y: auto; /* Enable vertical scrolling */
          border: 1px solid ${theme === 'light' ? '#ccc' : '#666'};
          padding: .6rem;
          margin-top: .6rem;
          background-color: ${theme === 'light' ? '#fff' : '#444'};
          border-radius: .3rem;
        }
        .combat-log ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .combat-log li {
          margin-bottom: .3rem;
        }
      `}</style>
    </div>
  );
}

export default SnowWitchGame;