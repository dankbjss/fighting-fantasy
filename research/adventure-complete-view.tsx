import React, { useState } from 'react';

const CompleteAdventureView = () => {
  const [showSheet, setShowSheet] = useState(false);
  
  // Sample character data
  const character = {
    name: "Avalana",
    type: "Rogue",
    skill: 8,
    stamina: 16,
    luck: 12,
    currentSkill: 8,
    currentStamina: 12,
    currentLuck: 10,
    specialAbility: "Reroll one failed LUCK test per adventure",
    inventory: ["Two daggers", "Leather armour", "Bundle of torches", "Knife Room Key", "Potion of Healing"]
  };
  
  // Sample wall temperament
  const wallTemperament = 1;
  
  // Sample node data
  const node = {
    id: '62',
    title: 'The Flirtatious Wall',
    content: 'You walk over to the east wall to get a closer look at the face. The face is intricately carved and well detailed; the eyebrows are furrowed; age and experience are suggested by multiple wrinkles and scars, and a great big bushy beard covers the lower half.<br/><br/>Its eyes are tightly shut, and its mouth is open a fraction on the left as if it were asleep.',
    choices: [
      { text: 'Shout at the face', nextNodeId: '92', wallEffect: 2 },
      { text: 'Poke its eye', nextNodeId: '97', wallEffect: 1 },
      { text: 'Caress its cheek', nextNodeId: '93' }
    ]
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-stone-100 font-serif relative">
      {/* Banner */}
      <header className="bg-amber-800 text-white p-4 shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center">The Five Room Dungeon</h1>
        <p className="text-xs italic text-center">A Fighting Fantasy Adventure</p>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow p-4 max-w-md mx-auto w-full relative">
        <div className="adventure-node mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="node-number mb-2 text-xs text-gray-500">
            Section {node.id}
          </div>
          
          {node.title && (
            <h2 className="text-xl font-bold mb-4">{node.title}</h2>
          )}
          
          <div className="node-content mb-6 leading-relaxed text-gray-800">
            <div dangerouslySetInnerHTML={{ __html: node.content }} />
          </div>
          
          <div className="choices-container mt-4">
            <h3 className="text-lg font-semibold mb-2">What will you do?</h3>
            <div className="space-y-2">
              {node.choices.map((choice, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 bg-amber-50 hover:bg-amber-100 
                    border border-amber-200 rounded-md transition-colors flex justify-between items-center"
                >
                  <span>{choice.text}</span>
                  <span className="text-gray-500 text-sm">→ {choice.nextNodeId}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 z-20">
        <button 
          onClick={() => setShowSheet(!showSheet)}
          className="bg-amber-700 text-white p-3 rounded-full shadow-lg"
          aria-label="Adventure Sheet"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </button>
      </div>
      
      {/* Adventure Sheet (Overlay) */}
      {showSheet && (
        <div className="adventure-sheet fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4">
          <div className="relative bg-amber-50 border-2 border-amber-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <button 
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              onClick={() => setShowSheet(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-center border-b-2 border-amber-800 pb-2 mb-4">Adventure Sheet</h2>
            
            <div className="character-info mb-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">{character.name}</h3>
                <p className="italic">{character.type}</p>
              </div>
              
              <div className="stats grid grid-cols-2 gap-4 mb-4">
                <div className="stat p-2 bg-white rounded border border-amber-300">
                  <span className="font-bold">SKILL:</span> {character.currentSkill}/{character.skill}
                </div>
                <div className="stat p-2 bg-white rounded border border-amber-300">
                  <span className="font-bold">STAMINA:</span> {character.currentStamina}/{character.stamina}
                </div>
                <div className="stat p-2 bg-white rounded border border-amber-300">
                  <span className="font-bold">LUCK:</span> {character.currentLuck}/{character.luck}
                </div>
                <div className="stat p-2 bg-white rounded border border-amber-300">
                  <span className="font-bold">WALL TEMP:</span> {wallTemperament}
                </div>
              </div>
              
              <div className="special-ability p-3 bg-yellow-100 rounded-md border border-yellow-300 mb-4">
                <h4 className="font-semibold">Special Ability:</h4>
                <p className="text-sm">{character.specialAbility}</p>
              </div>
            </div>
            
            <div className="inventory mb-6">
              <h3 className="text-lg font-semibold mb-2 border-b border-amber-400">Equipment & Items</h3>
              {character.inventory.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {character.inventory.map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-gray-500">You carry no special items yet.</p>
              )}
            </div>
            
            <div className="notes">
              <h3 className="text-lg font-semibold mb-2 border-b border-amber-400">Notes</h3>
              <textarea 
                className="w-full h-24 p-2 border border-amber-200 rounded-md text-sm"
                placeholder="Record important information here..."
                defaultValue="The wall seems to respond positively to gentle interaction. Need to remember the sequence: clouds, waves, trees."
              ></textarea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompleteAdventureView;
