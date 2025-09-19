import React, { useState } from 'react';

const CharacterCreationScreen = () => {
  const [step, setStep] = useState('class-selection'); // intro, class-selection, attributes, name, review
  const [characterClass, setCharacterClass] = useState('wizard'); // fighter, rogue, wizard
  const [characterName, setCharacterName] = useState('');
  const [diceRolled, setDiceRolled] = useState(true);
  
  // Class definitions
  const classes = {
    fighter: {
      skill: 9,
      stamina: 20,
      luck: 10,
      specialAbility: "Add +1 to all damage rolls",
      startingInventory: ["Longsword", "Chainmail", "Shield", "Bundle of torches"],
      description: "Being a mighty fighter, you believe you have the strength needed to overcome the obstacles inside the dungeon."
    },
    rogue: {
      skill: 8,
      stamina: 16,
      luck: 12,
      specialAbility: "Reroll one failed LUCK test per adventure",
      startingInventory: ["Two daggers", "Leather armour", "Bundle of torches"],
      description: "Being a crafty rogue, you reckon you have the guile required to grab the treasure and sneak out with your life."
    },
    wizard: {
      skill: 7,
      stamina: 14,
      luck: 11,
      specialAbility: "Cast one spell per adventure (FIREBALL, HEALING, or CONFUSION)",
      startingInventory: ["Spellbook", "Wand", "Bundle of torches"],
      description: "Being a wise wizard, you know you have the necessary intelligence to best the perils contained within."
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 font-serif">
      {/* Banner */}
      <header className="bg-amber-800 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">The Five Room Dungeon</h1>
        <p className="text-xs italic text-center">A Fighting Fantasy Adventure</p>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow p-4 max-w-md mx-auto w-full">
        <div className="character-creation bg-white rounded-lg shadow-md p-6">
          {step === 'class-selection' && (
            <div className="class-selection-step">
              <h2 className="text-2xl font-bold text-center mb-6">Choose Your Class</h2>
              
              <div className="dice-container mb-6 bg-amber-50 rounded-lg p-4 border border-amber-200">
                <p className="text-center mb-4">
                  Roll the dice to determine your character class, or choose one directly.
                </p>
                <div className="dice-result flex justify-center gap-4 mb-4">
                  <div className="die w-16 h-16 bg-white rounded-lg border-2 border-amber-300 flex items-center justify-center text-2xl font-bold shadow-md">
                    5
                  </div>
                </div>
                <div className="text-center">
                  <span className="bg-amber-200 px-3 py-1 rounded-full text-amber-800 font-semibold">
                    {diceRolled ? 'You are a Wizard!' : 'Roll or select a class'}
                  </span>
                </div>
              </div>
              
              <div className="mb-2 text-center text-sm text-gray-500">
                <p>Choose your class or accept your fate:</p>
                <p>1-2: Fighter | 3-4: Rogue | 5-6: Wizard</p>
              </div>
              
              <div className="class-options grid grid-cols-1 gap-4 mb-6">
                {Object.entries(classes).map(([className, classData]) => (
                  <button
                    key={className}
                    onClick={() => setCharacterClass(className)}
                    className={`
                      p-4 rounded-md border transition-colors text-left
                      ${characterClass === className 
                        ? 'bg-amber-100 border-amber-500' 
                        : 'bg-white border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">{className.charAt(0).toUpperCase() + className.slice(1)}</h3>
                      {characterClass === className && (
                        <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs">
                          Selected
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm italic my-2">{classData.description}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="stat-pill bg-red-50 border border-red-200 rounded-full px-2 py-1 text-xs text-center">
                        SKILL: {classData.skill}
                      </div>
                      <div className="stat-pill bg-green-50 border border-green-200 rounded-full px-2 py-1 text-xs text-center">
                        STAMINA: {classData.stamina}
                      </div>
                      <div className="stat-pill bg-blue-50 border border-blue-200 rounded-full px-2 py-1 text-xs text-center">
                        LUCK: {classData.luck}
                      </div>
                    </div>
                    
                    <div className="text-xs">
                      <span className="font-semibold">Special:</span> {classData.specialAbility}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={() => setStep('intro')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep('name')}
                  className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          
          {step === 'name' && (
            <div className="name-step">
              <h2 className="text-2xl font-bold text-center mb-6">Name Your Character</h2>
              
              <div className="mb-6">
                <div className="text-center mb-4">
                  <div className="inline-block bg-amber-100 rounded-full px-4 py-2 border border-amber-300">
                    <span className="font-semibold">{characterClass.charAt(0).toUpperCase() + characterClass.slice(1)}</span>
                  </div>
                </div>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is your name, brave adventurer?
                </label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="w-full px-3 py-3 border-2 border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                  placeholder="Enter your name"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is how you will be known throughout your adventure.
                </p>
              </div>
              
              <div className="wizard-portrait mb-6 flex justify-center">
                <div className="character-silhouette w-32 h-32 bg-amber-800 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={() => setStep('class-selection')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep('review')}
                  className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          
          {step === 'review' && (
            <div className="review-step">
              <h2 className="text-2xl font-bold text-center mb-4">Your Character</h2>
              <p className="text-center mb-6 text-gray-600">
                Review your character before beginning your adventure.
              </p>
              
              <div className="character-sheet bg-amber-50 border-2 border-amber-200 rounded-md p-4 mb-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">{characterName || "Unnamed Wizard"}</h3>
                  <p className="italic">{characterClass.charAt(0).toUpperCase() + characterClass.slice(1)}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="stat text-center">
                    <div className="font-bold text-red-800">SKILL</div>
                    <div className="text-2xl">{classes[characterClass].skill}</div>
                  </div>
                  <div className="stat text-center">
                    <div className="font-bold text-green-800">STAMINA</div>
                    <div className="text-2xl">{classes[characterClass].stamina}</div>
                  </div>
                  <div className="stat text-center">
                    <div className="font-bold text-blue-800">LUCK</div>
                    <div className="text-2xl">{classes[characterClass].luck}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold mb-1">Special Ability:</h4>
                  <p className="text-sm bg-white p-2 rounded border border-amber-200">
                    {classes[characterClass].specialAbility}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold mb-1">Starting Equipment:</h4>
                  <ul className="text-sm list-disc list-inside bg-white p-2 rounded border border-amber-200">
                    {classes[characterClass].startingInventory.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="bg-amber-100 inline-block px-4 py-2 rounded-md border border-amber-300">
                  <p className="text-sm italic">"{classes[characterClass].description}"</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={() => setStep('name')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Back
                </button>
                <button 
                  className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  Begin Adventure
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Progress indicator */}
      <footer className="bg-gray-100 p-2 border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between">
            <div className={`step-dot w-8 h-8 rounded-full flex items-center justify-center ${step === 'intro' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-800'}`}>1</div>
            <div className="step-line grow h-1 my-auto mx-1 bg-amber-200"></div>
            <div className={`step-dot w-8 h-8 rounded-full flex items-center justify-center ${step === 'class-selection' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-800'}`}>2</div>
            <div className="step-line grow h-1 my-auto mx-1 bg-amber-200"></div>
            <div className={`step-dot w-8 h-8 rounded-full flex items-center justify-center ${step === 'name' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-800'}`}>3</div>
            <div className="step-line grow h-1 my-auto mx-1 bg-amber-200"></div>
            <div className={`step-dot w-8 h-8 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-800'}`}>4</div>
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-600">
            <span>Intro</span>
            <span>Class</span>
            <span>Name</span>
            <span>Review</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CharacterCreationScreen;
