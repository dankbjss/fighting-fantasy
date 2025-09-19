import React, { useState, useRef, useEffect } from 'react';

const DiceRoller = () => {
  // State for dice configuration
  const [diceCount, setDiceCount] = useState(2);
  const [diceSides, setDiceSides] = useState(6);
  const [modifier, setModifier] = useState(0);
  
  // State for rolling
  const [isRolling, setIsRolling] = useState(false);
  const [currentRoll, setCurrentRoll] = useState(null);
  
  // State for roll history
  const [rollHistory, setRollHistory] = useState([]);
  
  // Ref for auto-scrolling the history log
  const historyEndRef = useRef(null);
  
  // Common dice types
  const diceTypes = [4, 6, 8, 10, 12, 20, 100];
  
  // Auto-scroll to bottom of history when new rolls are added
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [rollHistory]);
  
  // Handle the dice roll
  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Start with empty array for dice results
    let rollResults = [];
    let tempCurrentRoll = null;
    
    // Animation frames for "rolling" effect
    let frames = 0;
    const maxFrames = 10;
    const interval = setInterval(() => {
      // Generate new random values for each die
      rollResults = Array(diceCount).fill(0).map(() => 
        Math.floor(Math.random() * diceSides) + 1
      );
      
      // Calculate total with modifier
      const total = rollResults.reduce((sum, val) => sum + val, 0) + modifier;
      
      // Update current roll state
      tempCurrentRoll = {
        dice: rollResults,
        total: total,
        diceType: diceSides,
        modifier: modifier,
        timestamp: new Date()
      };
      
      setCurrentRoll(tempCurrentRoll);
      
      frames++;
      if (frames >= maxFrames) {
        clearInterval(interval);
        setIsRolling(false);
        
        // Add to history when animation completes
        setRollHistory(prev => [tempCurrentRoll, ...prev].slice(0, 50)); // Keep last 50 rolls
      }
    }, 100);
  };
  
  // Format the roll for display
  const formatRoll = (roll) => {
    if (!roll) return "";
    
    const diceStr = roll.dice.join(' + ');
    const modStr = roll.modifier !== 0 
      ? (roll.modifier > 0 ? ` + ${roll.modifier}` : ` - ${Math.abs(roll.modifier)}`) 
      : '';
      
    return `${diceCount}d${roll.diceType}: [${diceStr}]${modStr} = ${roll.total}`;
  };
  
  // Clear the roll history
  const clearHistory = () => {
    setRollHistory([]);
  };
  
  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-full bg-stone-100 text-stone-800 font-serif">
      <div className="bg-amber-800 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Dice Roller</h1>
        <p className="text-xs italic text-center">For The Five Room Dungeon</p>
      </div>
      
      <div className="p-4 max-w-md mx-auto w-full">
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-bold mb-4">Roll Configuration</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Dice
              </label>
              <div className="flex">
                <button 
                  onClick={() => setDiceCount(Math.max(1, diceCount - 1))}
                  className="px-3 py-2 bg-amber-200 text-amber-800 rounded-l-md hover:bg-amber-300 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={diceCount}
                  onChange={(e) => setDiceCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-3 py-2 border-y border-amber-300 text-center"
                />
                <button 
                  onClick={() => setDiceCount(Math.min(20, diceCount + 1))}
                  className="px-3 py-2 bg-amber-200 text-amber-800 rounded-r-md hover:bg-amber-300 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modifier
              </label>
              <div className="flex">
                <button 
                  onClick={() => setModifier(modifier - 1)}
                  className="px-3 py-2 bg-amber-200 text-amber-800 rounded-l-md hover:bg-amber-300 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={modifier}
                  onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border-y border-amber-300 text-center"
                />
                <button 
                  onClick={() => setModifier(modifier + 1)}
                  className="px-3 py-2 bg-amber-200 text-amber-800 rounded-r-md hover:bg-amber-300 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dice Type
            </label>
            <div className="flex flex-wrap gap-2 justify-center">
              {diceTypes.map(sides => (
                <button 
                  key={sides}
                  onClick={() => setDiceSides(sides)}
                  className={`
                    px-3 py-2 rounded-md transition-colors
                    ${diceSides === sides 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}
                  `}
                >
                  d{sides}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={rollDice}
            disabled={isRolling}
            className={`
              w-full py-3 rounded-md text-white text-lg font-bold shadow-md transition-colors
              ${isRolling 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-700'}
            `}
          >
            {isRolling 
              ? 'Rolling...' 
              : `Roll ${diceCount}d${diceSides}${modifier ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : ''}`
            }
          </button>
        </div>
        
        {/* Current Roll Display */}
        {currentRoll && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h2 className="text-lg font-bold mb-3">Current Roll</h2>
            
            <div className="flex justify-center mb-3">
              {currentRoll.dice.map((value, i) => (
                <div 
                  key={i}
                  className={`
                    die w-14 h-14 m-1 flex items-center justify-center text-xl font-bold rounded-md
                    ${isRolling 
                      ? 'animate-bounce bg-amber-100 border-2 border-amber-300' 
                      : 'bg-white border-2 border-amber-500 shadow-md'}
                  `}
                >
                  {value}
                </div>
              ))}
            </div>
            
            <div className="text-center font-semibold text-lg">
              {currentRoll.dice.join(' + ')}
              {currentRoll.modifier !== 0 && 
                (currentRoll.modifier > 0 
                  ? ` + ${currentRoll.modifier}` 
                  : ` - ${Math.abs(currentRoll.modifier)}`)
              }
              {' = '}
              <span className="text-amber-700 text-xl">{currentRoll.total}</span>
            </div>
          </div>
        )}
        
        {/* Roll History Log */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Roll History</h2>
            {rollHistory.length > 0 && (
              <button 
                onClick={clearHistory}
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          
          <div className="max-h-60 overflow-y-auto border rounded-md bg-amber-50">
            {rollHistory.length === 0 ? (
              <p className="text-center py-4 text-gray-500 italic">No rolls yet</p>
            ) : (
              <ul className="divide-y divide-amber-200">
                {rollHistory.map((roll, index) => (
                  <li key={index} className="p-2 text-sm hover:bg-amber-100 flex justify-between">
                    <span className="font-medium">{formatRoll(roll)}</span>
                    <span className="text-gray-500 text-xs">{formatTime(roll.timestamp)}</span>
                  </li>
                ))}
                <div ref={historyEndRef} />
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceRoller;
