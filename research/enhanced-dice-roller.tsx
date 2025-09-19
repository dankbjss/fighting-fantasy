import React, { useState, useRef, useEffect } from 'react';

const EnhancedDiceRoller = () => {
  // State for dice configuration
  const [dicePool, setDicePool] = useState([
    { type: 6, count: 2 }
  ]);
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
  
  // Add a new dice type to the pool
  const addDiceType = (type) => {
    setDicePool([...dicePool, { type, count: 1 }]);
  };
  
  // Remove a dice type from the pool
  const removeDiceType = (index) => {
    const newPool = [...dicePool];
    newPool.splice(index, 1);
    setDicePool(newPool);
  };
  
  // Update dice count for a specific type
  const updateDiceCount = (index, newCount) => {
    const newPool = [...dicePool];
    newCount = Math.max(1, Math.min(20, newCount)); // Clamp between 1 and 20
    newPool[index].count = newCount;
    setDicePool(newPool);
  };
  
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
      // Generate new random values for each die type
      rollResults = dicePool.map(dice => {
        const values = Array(dice.count).fill(0).map(() => 
          Math.floor(Math.random() * dice.type) + 1
        );
        return {
          type: dice.type,
          values
        };
      });
      
      // Calculate total with modifier
      const total = rollResults.reduce((sum, diceType) => 
        sum + diceType.values.reduce((diceSum, val) => diceSum + val, 0), 0
      ) + modifier;
      
      // Update current roll state
      tempCurrentRoll = {
        diceResults: rollResults,
        total: total,
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
  
  // Format roll for display in roll summary
  const formatRollSummary = () => {
    return dicePool.map(dice => `${dice.count}d${dice.type}`).join(' + ') 
      + (modifier !== 0 ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : '');
  };
  
  // Format roll for display in history
  const formatRollHistory = (roll) => {
    if (!roll) return "";
    
    const diceStr = roll.diceResults.map(result => {
      const valuesSum = result.values.reduce((sum, val) => sum + val, 0);
      return `${result.values.length}d${result.type}[${result.values.join(', ')}=${valuesSum}]`;
    }).join(' + ');
    
    const modStr = roll.modifier !== 0 
      ? (roll.modifier > 0 ? ` + ${roll.modifier}` : ` - ${Math.abs(roll.modifier)}`) 
      : '';
      
    return `${diceStr}${modStr} = ${roll.total}`;
  };
  
  // Clear the roll history
  const clearHistory = () => {
    setRollHistory([]);
  };
  
  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  // Get die shape based on type
  const getDieShape = (type) => {
    switch(type) {
      case 4: return 'triangle-up';
      case 8: return 'diamond';
      case 10: return 'pentagon';
      case 12: return 'hexagon';
      case 20: return 'octagon';
      case 100: return 'circle';
      default: return 'square'; // d6 is default
    }
  };
  
  // Render die with appropriate shape
  const renderDie = (value, type, isAnimating = false) => {
    const shape = getDieShape(type);
    let shapeClasses = 'flex items-center justify-center';
    
    switch(shape) {
      case 'triangle-up':
        shapeClasses += ' clip-triangle';
        break;
      case 'diamond':
        shapeClasses += ' rotate-45';
        break;
      case 'pentagon':
        shapeClasses += ' clip-pentagon';
        break;
      case 'hexagon':
        shapeClasses += ' clip-hexagon';
        break;
      case 'octagon':
        shapeClasses += ' clip-octagon';
        break;
      case 'circle':
        shapeClasses += ' rounded-full';
        break;
      default:
        shapeClasses += ' rounded-md'; // square for d6
    }
    
    // Get background color based on dice type
    const getColor = () => {
      switch(type) {
        case 4: return 'bg-red-100 border-red-500';
        case 6: return 'bg-amber-100 border-amber-500';
        case 8: return 'bg-blue-100 border-blue-500';
        case 10: return 'bg-green-100 border-green-500';
        case 12: return 'bg-purple-100 border-purple-500';
        case 20: return 'bg-indigo-100 border-indigo-500';
        case 100: return 'bg-pink-100 border-pink-500';
        default: return 'bg-amber-100 border-amber-500';
      }
    };
    
    return (
      <div className={`die relative w-14 h-14 m-1 ${isAnimating ? 'animate-bounce' : ''}`}>
        <div className={`absolute inset-0 ${shapeClasses} ${getColor()} border-2 z-0`}></div>
        <div className={`absolute inset-0 flex items-center justify-center font-bold text-lg z-10 ${shape === 'diamond' ? '-rotate-45' : ''}`}>
          {value}
        </div>
        <div className="absolute -bottom-1 -right-1 text-xs font-semibold bg-gray-800 text-white px-1 rounded-sm z-20">
          d{type}
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full bg-stone-100 text-stone-800 font-serif">
      <div className="bg-amber-800 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Enhanced Dice Roller</h1>
        <p className="text-xs italic text-center">For The Five Room Dungeon</p>
      </div>
      
      <div className="p-4 max-w-md mx-auto w-full">
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-bold mb-4">Dice Pool</h2>
          
          {/* Current Dice Pool */}
          <div className="mb-4 space-y-3">
            {dicePool.map((dice, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <div className="p-1 rounded-md bg-gray-200 flex items-center justify-center w-6 h-6 text-xs">
                  d{dice.type}
                </div>
                <div className="flex flex-1">
                  <button 
                    onClick={() => updateDiceCount(index, dice.count - 1)}
                    className="px-2 py-1 bg-amber-200 text-amber-800 rounded-l-md hover:bg-amber-300 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={dice.count}
                    onChange={(e) => updateDiceCount(index, parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 border-y border-amber-300 text-center"
                  />
                  <button 
                    onClick={() => updateDiceCount(index, dice.count + 1)}
                    className="px-2 py-1 bg-amber-200 text-amber-800 rounded-r-md hover:bg-amber-300 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => removeDiceType(index)}
                  className="p-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          {/* Add Dice Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Dice Type
            </label>
            <div className="flex flex-wrap gap-2 justify-center">
              {diceTypes.map(type => (
                <button 
                  key={type}
                  onClick={() => addDiceType(type)}
                  className="px-3 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors"
                >
                  d{type}
                </button>
              ))}
            </div>
          </div>
          
          {/* Modifier */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modifier
            </label>
            <div className="flex max-w-xs mx-auto">
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
          
          {/* Roll Button */}
          <button
            onClick={rollDice}
            disabled={isRolling || dicePool.length === 0}
            className={`
              w-full py-3 rounded-md text-white text-lg font-bold shadow-md transition-colors
              ${isRolling || dicePool.length === 0
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-700'}
            `}
          >
            {isRolling 
              ? 'Rolling...' 
              : dicePool.length === 0
                ? 'Add dice to roll'
                : `Roll ${formatRollSummary()}`
            }
          </button>
        </div>
        
        {/* Current Roll Display */}
        {currentRoll && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h2 className="text-lg font-bold mb-3">Current Roll</h2>
            
            <div className="flex flex-wrap justify-center mb-3">
              {currentRoll.diceResults.map((result, diceIndex) => (
                <div key={diceIndex} className="dice-group mb-2">
                  <div className="text-xs text-center text-gray-500 mb-1">{result.values.length}d{result.type}</div>
                  <div className="flex flex-wrap justify-center">
                    {result.values.map((value, i) => renderDie(value, result.type, isRolling))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center font-semibold text-lg">
              {currentRoll.diceResults.map((result, diceIndex) => {
                const valuesSum = result.values.reduce((sum, val) => sum + val, 0);
                return (
                  <span key={diceIndex}>
                    {diceIndex > 0 && ' + '}
                    <span className="whitespace-nowrap">
                      {result.values.length}d{result.type}
                      <span className="text-gray-600">[{result.values.join(', ')}]</span>
                      <span className="text-amber-700">=</span>
                      <span className="text-amber-700">{valuesSum}</span>
                    </span>
                  </span>
                );
              })}
              {currentRoll.modifier !== 0 && (
                <span className="whitespace-nowrap">
                  {' '}
                  {currentRoll.modifier > 0 ? '+ ' : '- '}
                  {Math.abs(currentRoll.modifier)}
                </span>
              )}
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
                  <li key={index} className="p-2 text-sm hover:bg-amber-100">
                    <div className="flex justify-between">
                      <span className="font-medium">Result: {roll.total}</span>
                      <span className="text-gray-500 text-xs">{formatTime(roll.timestamp)}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatRollHistory(roll)}
                    </div>
                  </li>
                ))}
                <div ref={historyEndRef} />
              </ul>
            )}
          </div>
        </div>
      </div>
      
      {/* Custom CSS for clip paths */}
      <style jsx>{`
        .clip-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
        
        .clip-pentagon {
          clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        }
        
        .clip-hexagon {
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        }
        
        .clip-octagon {
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
        }
      `}</style>
    </div>
  );
};

export default EnhancedDiceRoller;
