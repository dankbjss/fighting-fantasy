interface DiceRollerProps {
  onRoll: (count: number, sides?: number) => { rolls: number[]; total: number };
  onClose: () => void;
  result: { rolls: number[]; total: number } | null;
}

export const DiceRoller = ({ onRoll, onClose, result }: DiceRollerProps) => {
  return (
    <div className="dice-roller-overlay">
      <div className="dice-roller">
        <h3>Dice Roller</h3>
        
        <div className="dice-actions">
          <button onClick={() => onRoll(2)}>Roll 2d6</button>
          <button onClick={() => onRoll(1, 20)}>Roll 1d20</button>
          <button onClick={onClose}>Close</button>
        </div>
        
        {result && (
          <div className="dice-result">
            <p>Rolled: {result.rolls.join(' + ')} = {result.total}</p>
            {result.rolls.length === 2 && (
              <p>Total with Skill: {result.total + 7} (assuming SKILL 7)</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};