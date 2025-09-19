import React, { useState } from 'react';

const CombatView = () => {
  // Sample character data - Fighter
  const character = {
    name: "Thorgar",
    type: "Fighter",
    skill: 9,
    stamina: 20,
    luck: 10,
    currentSkill: 9,
    currentStamina: 16,
    currentLuck: 8,
    specialAbility: "Add +1 to all damage rolls",
    inventory: ["Longsword", "Chainmail", "Shield", "Bundle of torches", "Knife Room Key"]
  };
  
  // Sample monster data - Skeleton
  const monster = {
    name: "Skeleton",
    skill: 9,
    stamina: 13,
    currentStamina: 9
  };
  
  // Battle state
  const [battleState, setBattleState] = useState({
    round: 3,
    playerRoll: { dice1: 4, dice2: 6, total: 19 },
    monsterRoll: { dice1: 2, dice2: 3, total: 14 },
    currentAction: 'result', // start, rolling, result, end
    battleLog: [
      { message: 'The battle begins...', type: 'info', round: 1 },
      { message: 'You hit the Skeleton for 2 damage!', type: 'success', round: 1 },
      { message: 'The Skeleton hits you for 2 damage!', type: 'danger', round: 2 },
      { message: 'You hit the Skeleton for 2 damage!', type: 'success', round: 3 }
    ]
  });
  
  return (
    <div className="flex flex-col min-h-screen bg-stone-100 font-serif relative">
      {/* Banner */}
      <header className="bg-amber-800 text-white p-4 shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center">The Five Room Dungeon</h1>
        <p className="text-xs italic text-center">A Fighting Fantasy Adventure</p>
      </header>
      
      {/* Main Content - Battle System */}
      <main className="flex-grow p-4 max-w-md mx-auto w-full relative">
        <div className="battle-system bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Combat!</h2>
          
          <div className="section-label rounded-md bg-red-100 border border-red-200 p-2 mb-4 text-center text-sm">
            <span className="font-bold">Section 193:</span> Battle with the Skeleton Guardian
          </div>
          
          <div className="combatants grid grid-cols-2 gap-4 mb-6">
            {/* Player stats */}
            <div className="player-stats bg-blue-50 p-3 rounded-md border border-blue-200">
              <h3 className="font-bold text-center mb-2">{character.name}</h3>
              <div className="stats space-y-1 text-sm">
                <div><span className="font-semibold">SKILL:</span> {character.currentSkill}</div>
                <div><span className="font-semibold">STAMINA:</span> {character.currentStamina}/{character.stamina}</div>
                <div className="stamina-bar h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${(character.currentStamina / character.stamina) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Monster stats */}
            <div className="monster-stats bg-red-50 p-3 rounded-md border border-red-200">
              <h3 className="font-bold text-center mb-2">{monster.name}</h3>
              <div className="stats space-y-1 text-sm">
                <div><span className="font-semibold">SKILL:</span> {monster.skill}</div>
                <div><span className="font-semibold">STAMINA:</span> {monster.currentStamina}/{monster.stamina}</div>
                <div className="stamina-bar h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{ width: `${(monster.currentStamina / monster.stamina) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Battle visuals section */}
          <div className="battle-visuals mb-6">
            <div className="attack-result grid grid-cols-2 gap-4 h-24 bg-amber-50 rounded-md p-3">
              <div className="player-roll text-center">
                <div className="text-sm font-semibold text-blue-700">Your Attack</div>
                <div className="dice-result flex justify-center gap-2 my-1">
                  <div className="die bg-white rounded border p-1 w-8 h-8 flex items-center justify-center">
                    {battleState.playerRoll.dice1}
                  </div>
                  <div className="die bg-white rounded border p-1 w-8 h-8 flex items-center justify-center">
                    {battleState.playerRoll.dice2}
                  </div>
                </div>
                <div className="text-sm">
                  + {character.currentSkill} = <span className="font-bold">{battleState.playerRoll.total}</span>
                </div>
              </div>
              
              <div className="monster-roll text-center">
                <div className="text-sm font-semibold text-red-700">{monster.name}'s Attack</div>
                <div className="dice-result flex justify-center gap-2 my-1">
                  <div className="die bg-white rounded border p-1 w-8 h-8 flex items-center justify-center">
                    {battleState.monsterRoll.dice1}
                  </div>
                  <div className="die bg-white rounded border p-1 w-8 h-8 flex items-center justify-center">
                    {battleState.monsterRoll.dice2}
                  </div>
                </div>
                <div className="text-sm">
                  + {monster.skill} = <span className="font-bold">{battleState.monsterRoll.total}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Battle log */}
          <div className="battle-log bg-gray-50 border rounded-md p-3 mb-6 max-h-32 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-2">Battle Log:</h3>
            <ul className="space-y-1">
              {battleState.battleLog.map((log, index) => (
                <li 
                  key={index} 
                  className={`text-sm ${
                    log.type === 'success' ? 'text-green-700' :
                    log.type === 'danger' ? 'text-red-700' : 'text-gray-700'
                  }`}
                >
                  <span className="font-mono text-xs text-gray-500 mr-1">R{log.round}</span> {log.message}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Combat actions */}
          <div className="combat-actions">
            <h3 className="text-center font-semibold mb-2">What will you do?</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                className="py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Attack
              </button>
              <button
                className="py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Flee
              </button>
              <button
                className="py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Heal
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Character Summary (Fixed at bottom) */}
      <div className="character-summary sticky bottom-0 bg-amber-800 text-white p-2 shadow-lg">
        <div className="max-w-md mx-auto w-full flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-bold mr-2">{character.name} the {character.type}</span>
            <span className="text-xs border border-white px-2 py-1 rounded">Round {battleState.round}</span>
          </div>
          <div className="stats flex space-x-3 text-sm">
            <div>SK:{character.currentSkill}</div>
            <div>ST:{character.currentStamina}/{character.stamina}</div>
            <div>LK:{character.currentLuck}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombatView;
