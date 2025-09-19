import React, { useState } from 'react';

// This component simulates the full flow through all steps
const FullCharacterCreationFlow = () => {
  // Which screen to display
  const [currentScreen, setCurrentScreen] = useState('intro');
  
  // Character data that gets built up through the flow
  const [character, setCharacter] = useState({
    name: '',
    class: '',
    skill: 0,
    stamina: 0,
    luck: 0,
    specialAbility: '',
    inventory: []
  });
  
  // Render the appropriate screen
  const renderScreen = () => {
    switch(currentScreen) {
      case 'intro':
        return <IntroScreen onContinue={() => setCurrentScreen('class')} />;
      case 'class':
        return (
          <ClassSelectionScreen 
            onSelectClass={(classData) => {
              setCharacter(prev => ({
                ...prev,
                class: classData.name,
                skill: classData.skill,
                stamina: classData.stamina,
                luck: classData.luck,
                specialAbility: classData.specialAbility,
                inventory: classData.startingInventory
              }));
              setCurrentScreen('name');
            }}
            onBack={() => setCurrentScreen('intro')}
          />
        );
      case 'name':
        return (
          <NameScreen 
            selectedClass={character.class}
            onNameSubmit={(name) => {
              setCharacter(prev => ({ ...prev, name }));
              setCurrentScreen('review');
            }}
            onBack={() => setCurrentScreen('class')}
          />
        );
      case 'review':
        return (
          <ReviewScreen 
            character={character}
            onBack={() => setCurrentScreen('name')}
            onStartAdventure={() => setCurrentScreen('complete')}
          />
        );
      case 'complete':
        return <AdventureStartScreen character={character} />;
      default:
        return <IntroScreen onContinue={() => setCurrentScreen('class')} />;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-stone-100 font-serif">
      {/* Banner Header */}
      <header className="bg-amber-800 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">The Five Room Dungeon</h1>
        <p className="text-xs italic text-center">A Fighting Fantasy Adventure</p>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-grow p-4 max-w-md mx-auto w-full">
        {renderScreen()}
      </main>
      
      {/* Progress Indicator */}
      <footer className="bg-gray-100 p-2 border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between">
            <div className={`step-dot w-8 h-8 rounded-full flex items-center justify-center ${currentScreen === 'intro' ? 'bg-amber-600 text-white' : currentScreen === 'complete' ? 'bg-amber-600 text-white' : currentScreen === 'class' || currentScreen === 'name' || currentScreen === 'review' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-800'}`}>1</div>
            <div className="step-line grow h-1 my-auto mx-1 bg-amber-200"></div>
            <div className={`step-dot w-8 h-8 rounded-full flex items-center justify-center ${currentScreen === 'class' ? 'bg-amber-600 text-white' : currentScreen === 'name' || currentScreen === 'review' || currentScreen === 'complete' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-800'}`}>2</div>
            <div className="step-line grow h-1 my-auto mx-1 bg-amber-200"></div>
            <div className={`step-dot w-8 h-8 rounded-full flex items-center justify-center ${currentScreen === 'name' ? 'bg-amber-600 text-white' : currentScreen === 'review' || currentScreen === 'complete' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-800'}`}>3</div>
            <div className="step-line grow h-1 my-auto mx-1 bg-amber-200"></div>
            <div className={`step-dot w-8 h-8 rounded-full flex items-center justify-center ${currentScreen === 'review' || currentScreen === 'complete' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-800'}`}>4</div>
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

// STEP 1: Introduction Screen
const IntroScreen = ({ onContinue }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-center mb-4">Welcome, Adventurer!</h2>
      
      <div className="mx-auto w-20 h-20 mb-4 bg-amber-800 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      
      <p className="mb-4 text-center">
        Legend tells of a dungeon not far from town beneath Mt. Bryntor said to contain 
        treasures of incalculable wealth.
      </p>
      
      <p className="mb-4">
        Chief among the dungeon's claims to fame, however, is that no one has ever retrieved 
        the treasures contained therein. For the dungeon is filled with perilous puzzles, 
        tyrannous traps, mighty monsters and other such alliterative dangers.
      </p>
      
      <p className="mb-6 text-center font-bold">
        Are you brave enough to take on the challenge?
      </p>
      
      <div className="text-center">
        <button 
          onClick={onContinue}
          className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors shadow-md"
        >
          Begin Your Adventure
        </button>
      </div>
    </div>
  );
};

// STEP 2: Class Selection Screen
const ClassSelectionScreen = ({ onSelectClass, onBack }) => {
  const [diceRolled, setDiceRolled] = useState(false);
  const [diceValue, setDiceValue] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  
  // Class definitions
  const classes = {
    fighter: {
      name: 'Fighter',
      skill: 9,
      stamina: 20,
      luck: 10,
      specialAbility: "Add +1 to all damage rolls",
      startingInventory: ["Longsword", "Chainmail", "Shield", "Bundle of torches"],
      description: "Being a mighty fighter, you believe you have the strength needed to overcome the obstacles inside the dungeon."
    },
    rogue: {
      name: 'Rogue',
      skill: 8,
      stamina: 16,
      luck: 12,
      specialAbility: "Reroll one failed LUCK test per adventure",
      startingInventory: ["Two daggers", "Leather armour", "Bundle of torches"],
      description: "Being a crafty rogue, you reckon you have the guile required to grab the treasure and sneak out with your life."
    },
    wizard: {
      name: 'Wizard',
      skill: 7,
      stamina: 14,
      luck: 11,
      specialAbility: "Cast one spell per adventure (FIREBALL, HEALING, or CONFUSION)",
      startingInventory: ["Spellbook", "Wand", "Bundle of torches"],
      description: "Being a wise wizard, you know you have the necessary intelligence to best the perils contained within."
    }
  };
  
  // Roll the dice for random class selection
  const rollDice = () => {
    // Animation effect
    setDiceRolled(true);
    setDiceValue(null);
    
    // Simulate rolling animation
    const rollAnimation = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);
    
    // Stop after 1 second and set final value
    setTimeout(() => {
      clearInterval(rollAnimation);
      const finalValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalValue);
      
      // Determine class based on roll
      let rolledClass;
      if (finalValue <= 2) rolledClass = 'fighter';
      else if (finalValue <= 4) rolledClass = 'rogue';
      else rolledClass = 'wizard';
      
      setSelectedClass(rolledClass);
    }, 1000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-center mb-6">Choose Your Class</h2>
      
      <div className="dice-container mb-6">
        <p className="text-center mb-4">
          Roll the dice to determine your character class, or choose one directly.
        </p>
        
        <div className="flex justify-center">
          <div 
            className={`die w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl font-bold ${
              diceRolled 
                ? 'bg-white border-amber-500 shadow-md' 
                : 'bg-gray-100 border-gray-300'
            } ${diceValue === null && diceRolled ? 'animate-pulse' : ''}`}
          >
            {diceValue || '?'}
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <button 
            onClick={rollDice}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors shadow"
          >
            Roll for Class (1d6)
          </button>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-2">
          1-2: Fighter | 3-4: Rogue | 5-6: Wizard
        </div>
        
        {selectedClass && (
          <div className="text-center mt-3">
            <span className="bg-amber-200 px-3 py-1 rounded-full text-amber-800 font-semibold">
              You rolled a {diceValue}: {classes[selectedClass].name}!
            </span>
          </div>
        )}
      </div>
      
      <div className="class-options space-y-4 mb-6">
        {Object.entries(classes).map(([key, classData]) => (
          <button
            key={key}
            onClick={() => setSelectedClass(key)}
            className={`
              w-full p-4 rounded-md border transition-colors text-left
              ${selectedClass === key 
                ? 'bg-amber-100 border-amber-500 shadow-md' 
                : 'bg-white border-gray-300 hover:bg-gray-50'}
            `}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">{classData.name}</h3>
              {selectedClass === key && (
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
            
            <div className="text-xs text-gray-700">
              <span className="font-semibold">Special:</span> {classData.specialAbility}
            </div>
          </button>
        ))}
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors shadow"
        >
          Back
        </button>
        <button 
          onClick={() => selectedClass && onSelectClass(classes[selectedClass])}
          disabled={!selectedClass}
          className={`px-6 py-2 rounded-md transition-colors shadow ${
            selectedClass 
              ? 'bg-amber-600 text-white hover:bg-amber-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// STEP 3: Name Screen
const NameScreen = ({ selectedClass, onNameSubmit, onBack }) => {
  const [name, setName] = useState('');
  
  // Character portraits for each class
  const classPortraits = {
    'Fighter': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
      </svg>
    ),
    'Rogue': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
        <circle cx="11" cy="11" r="2"></circle>
      </svg>
    ),
    'Wizard': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
    )
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-center mb-4">Name Your Character</h2>
      
      <div className="mb-6">
        <div className="text-center mb-4">
          <div className="inline-block bg-amber-100 rounded-full px-4 py-2 border border-amber-300">
            <span className="font-semibold">{selectedClass}</span>
          </div>
        </div>
        
        <div className="character-portrait mb-6 flex justify-center">
          <div className="character-silhouette w-32 h-32 bg-amber-800 rounded-full flex items-center justify-center">
            {classPortraits[selectedClass]}
          </div>
        </div>
        
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What is your name, brave adventurer?
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-3 border-2 border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
          placeholder="Enter your name"
        />
        <p className="text-xs text-gray-500 mt-1">
          This is how you will be known throughout your adventure.
        </p>
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors shadow"
        >
          Back
        </button>
        <button 
          onClick={() => onNameSubmit(name || 'Adventurer')}
          className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors shadow"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// STEP 4: Review Screen
const ReviewScreen = ({ character, onBack, onStartAdventure }) => {
  // Class-specific background colors
  const classColors = {
    'Fighter': 'bg-red-50',
    'Rogue': 'bg-blue-50',
    'Wizard': 'bg-purple-50'
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-center mb-4">Your Character</h2>
      <p className="text-center mb-6 text-gray-600">
        Review your character before beginning your adventure.
      </p>
      
      <div className={`character-sheet ${classColors[character.class] || 'bg-amber-50'} border-2 border-amber-200 rounded-md p-4 mb-6`}>
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold">{character.name}</h3>
          <p className="italic">{character.class}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="stat text-center">
            <div className="font-bold text-red-800">SKILL</div>
            <div className="text-2xl">{character.skill}</div>
          </div>
          <div className="stat text-center">
            <div className="font-bold text-green-800">STAMINA</div>
            <div className="text-2xl">{character.stamina}</div>
          </div>
          <div className="stat text-center">
            <div className="font-bold text-blue-800">LUCK</div>
            <div className="text-2xl">{character.luck}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-bold mb-1">Special Ability:</h4>
          <p className="text-sm bg-white p-2 rounded border border-amber-200">
            {character.specialAbility}
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-1">Starting Equipment:</h4>
          <ul className="text-sm list-disc list-inside bg-white p-2 rounded border border-amber-200">
            {character.inventory.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <div className="bg-amber-100 inline-block px-4 py-2 rounded-md border border-amber-300">
          <p className="text-sm italic">
            {character.class === "Fighter" && "Being a mighty fighter, you believe you have the strength needed to overcome the obstacles inside the dungeon."}
            {character.class === "Rogue" && "Being a crafty rogue, you reckon you have the guile required to grab the treasure and sneak out with your life."}
            {character.class === "Wizard" && "Being a wise wizard, you know you have the necessary intelligence to best the perils contained within."}
          </p>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors shadow"
        >
          Back
        </button>
        <button 
          onClick={onStartAdventure}
          className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors shadow"
        >
          Begin Adventure
        </button>
      </div>
    </div>
  );
};

// Final Screen: Adventure Start
const AdventureStartScreen = ({ character }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-center mb-4">The Adventure Begins!</h2>
      
      <div className="mb-6 flex justify-center">
        <div className="w-24 h-24 bg-amber-800 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
            <path d="M18 7v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V7"></path>
            <rect x="3" y="7" width="18" height="4" rx="1"></rect>
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="12" y1="19" x2="12" y2="21"></line>
          </svg>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <p className="mb-4">
          <span className="font-bold">{character.name} the {character.class}</span>, 
          your journey into the Five Room Dungeon is about to begin!
        </p>
        <p className="mb-4">
          Ahead lies danger, mystery, and perhaps untold riches - if you survive.
        </p>
        <p className="text-amber-700 font-bold">
          Turn to section 1 to begin your adventure...
        </p>
      </div>
      
      <div className="p-4 bg-stone-100 rounded-md mb-6 text-sm">
        <h3 className="font-bold mb-2">Adventure Sheet</h3>
        <div className="grid grid-cols-2 gap-2">
          <div><span className="font-semibold">SKILL:</span> {character.skill}</div>
          <div><span className="font-semibold">STAMINA:</span> {character.stamina}</div>
          <div><span className="font-semibold">LUCK:</span> {character.luck}</div>
          <div><span className="font-semibold">WALL TEMP:</span> 0</div>
        </div>
      </div>
      
      <div className="text-center">
        <button className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors shadow-lg">
          Enter the Dungeon
        </button>
      </div>
    </div>
  );
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
`;
document.head.appendChild(style);

export default FullCharacterCreationFlow;
