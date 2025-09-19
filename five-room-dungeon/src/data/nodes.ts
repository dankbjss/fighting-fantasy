import { AdventureNode, Character, Enemy, NodeEffect } from './types';

export const adventureNodes: Record<string, AdventureNode> = {
  '1': {
    id: '1',
    title: 'The Dungeon Entrance',
    content: 'Having travelled many miles over treacherous terrain, you come finally to the site of the fabled dungeon. Carved into the south side of Mt. Bryntor you see a smooth rectangle, 6 foot high and 2 foot wide. You might call it a door save for the fact it lacks a feature vital to all portals: a handle, or any other means of opening it.',
    choices: [
      { text: 'Go back home', nextNodeId: '73' },
      { text: 'Investigate the area', nextNodeId: '42' }
    ]
  },
  '2': {
    id: '2',
    title: 'The Talking Wall - Poked',
    content: 'You jab at the solid rock with your index finger, and it is surprisingly squishy. The mouth opens, screaming "Owww!", the eyes roll around before resting on you.\n\nThe face speaks in a gravelly voice, saying: "What the hell did you do that for?"\n\nAdd 1 to your Wall Temperament score.',
    choices: [
      { text: 'Apologize', nextNodeId: '26', wallEffect: -1 },
      { text: 'Deflect', nextNodeId: '35', wallEffect: 1 },
      { text: 'Double down', nextNodeId: '9', wallEffect: 2 }
    ],
    effect: (character: Character, inventory: string[]): NodeEffect => ({
      character,
      inventory,
      wallTemperament: 1
    })
  },
  '3': {
    id: '3',
    title: 'Treasure Chamber',
    content: 'Looking back at the skeletal remains heaped on the floor, fully confident you have bested the challenges of this dungeon, you progress into the corridor.\n\nYou come to the end of the passage and are dazzled by the reflections given off by your torchlight in the chamber you enter.\n\nAll around you are heaps of gold, gems, artworks, and other such treasures. Finally, you have made it to the prize you have sought for so long.',
    choices: [
      { text: 'Grab some treasure', nextNodeId: '54' },
      { text: 'Leave the dungeon', nextNodeId: '18' }
    ]
  },
  '4': {
    id: '4',
    title: 'Flirtatious Response',
    content: 'You look the face right in the eye, saying "Can\'t it be both?" and then wink.\n\nA hint of red splashes across the grey stone of the face\'s cheeks and it says: "Oh my!"',
    choices: [
      { text: 'Continue', nextNodeId: '98' }
    ]
  },
  '5': {
    id: '5',
    title: 'Fighter Response',
    content: 'You are a Fighter, so you look from the face to your sword and say: "Yeah. I swing it and it chops stuff."',
    choices: [
      { text: 'Continue', nextNodeId: '52' }
    ]
  },
  '6': {
    id: '6',
    title: 'Incorrect Button Sequence - Trees, Clouds, Waves',
    content: 'You press the trees button first, then clouds, and finally waves. The buttons depress easily enough, but the door doesn\'t respond to this sequence. After a few seconds, the buttons reset with a soft click.\n\nThe entrance remains sealed. This combination doesn\'t match the riddle\'s answer.',
    choices: [
      { text: 'Try another combination', nextNodeId: '42' }
    ]
  },
  '7': {
    id: '7',
    title: 'State Your Business',
    content: 'You say to the face: "I am here to fight monsters, solve puzzles, and claim treasure."\n\nIf your Wall Temperament score is 2 or higher, the face rolls its eyes and says: "Great, another one."\n\nThe face looks to you and asks: "Should you escape the dungeon, what do you plan to do with the spoils of your quest?"',
    choices: [
      { text: 'Say you\'ll help others', nextNodeId: '60' },
      { text: 'Say you\'ll go on a bender', nextNodeId: '74' },
      { text: 'Say you don\'t know', nextNodeId: '31' }
    ]
  },
  '8': {
    id: '8',
    title: 'Honorable Path',
    content: 'The wall says: "You seem a mostly honorable sort. I shall open up the next room to you."\n\nYou hear the scraping of stone and, turning around, you see the west wall opens up, revealing another corridor.\n\nBehind you, the wall says: "I need to catch some shut-eye. You be careful now."',
    choices: [
      { text: 'Continue', nextNodeId: '67' }
    ]
  },
  '9': {
    id: '9',
    title: 'Disrespectful Response',
    content: 'You look at the face and say: "You\'re a wall carving, I don\'t owe you jack."\n\nThe face looks you up and down and says: "You\'re a bag of bones - right back at you, pal."\n\nAdd 2 to your Wall Temperament score.',
    choices: [
      { text: 'Continue', nextNodeId: '98', wallEffect: 2 }
    ],
    effect: (character: Character, inventory: string[]): NodeEffect => ({
      character,
      inventory,
      wallTemperament: 2
    })
  },
  '10': {
    id: '10',
    title: 'Locked Door',
    content: 'The door is locked, and you currently have no means of changing that.',
    choices: [
      { text: 'Go back', nextNodeId: '41' }
    ]
  },
  '11': {
    id: '11',
    title: 'Drink Potion',
    content: 'You uncork the bottle and drink the red liquid. It tastes of strawberries with a hint of mint. You feel a warm glow suffuse your body.\n\nRestore 4 STAMINA points (up to your Initial score).',
    choices: [
      { text: 'Continue', nextNodeId: '69' }
    ],
    effect: (character: Character, inventory: string[]): NodeEffect => ({
      character: {
        ...character,
        currentStamina: Math.min(character.stamina, character.currentStamina + 4)
      },
      inventory: inventory.filter(item => item !== 'Potion of Healing')
    })
  },
  '12': {
    id: '12',
    title: 'Somewhat Annoyed Wall',
    content: 'The wall sighs and says: "You\'re a bit of a knob, but I\'ve seen worse."\n\nYou hear the scraping of stone and, turning around, you see the west wall opens up, revealing another corridor.\n\nBehind you, the wall says: "The rest of the dungeon lies onward. Now off you fuck, I need my beauty sleep."',
    choices: [
      { text: 'Continue', nextNodeId: '67' }
    ]
  },
  '13': {
    id: '13',
    title: 'Skeleton Defeated',
    content: 'Shrieking "NOOOOOOOOOO!" the skeleton crumples to the ground, finally dead rather than undead.\n\nGrabbing the key from its neck, you go over to the golden door, which now opens for you, revealing a tunnel beyond. Add "Golden Key" to your adventure sheet.',
    choices: [
      { text: 'Go forth', nextNodeId: '3' },
      { text: 'Back out', nextNodeId: '73' }
    ],
    effect: (character: Character, inventory: string[]): NodeEffect => ({
      character,
      inventory: [...inventory, 'Golden Key']
    })
  },
  '14': {
    id: '14',
    title: 'Wizard Innuendo',
    content: 'The face looks you over, examining your Wizard\'s robes, and says: "Is that a wand in your robes or are you just pleased to see me?"',
    choices: [
      { text: 'Be literal', nextNodeId: '83' },
      { text: 'Play along', nextNodeId: '4' }
    ]
  },
  '15': {
    id: '15',
    title: 'Knife Defeated',
    content: 'The knife falls to the ground, no longer animate, leaving you free to inspect the items on the table.\n\nThe table is small and of wooden construction. On top of it is a brass key and a little bottle filled with a red liquid.\n\nYou pick up the key and put it in your backpack. Add "Knife Room Key" to your adventure sheet.',
    choices: [
      { text: 'Inspect the bottle', nextNodeId: '66' },
      { text: 'Go to the door', nextNodeId: '69' }
    ],
    effect: (character: Character, inventory: string[]): NodeEffect => ({
      character,
      inventory: [...inventory, 'Knife Room Key']
    })
  },
  '17': {
    id: '17',
    title: 'True Hero Ending',
    content: 'You return to the village, and while most of the inhabitants think you a fool for leaving so much treasure behind in this economy, some find the tale of your exploits amusing.\n\nForevermore, you are known as the only person to ever come back from the five room dungeon.\n\nCongratulations! You have completed The Five Room Dungeon adventure as a True Hero!',
    choices: [
      { text: 'Play again', nextNodeId: '1', action: 'reset' }
    ]
  },
  '18': {
    id: '18',
    title: 'Leave Treasure Behind',
    content: 'Looking over the treasures, you realize that no matter how many you take, they will never fill the void in your life. You turn back and walk through the dungeon.',
    choices: [
      { 
        text: 'Continue with low temperament', 
        nextNodeId: '78', 
        condition: (character: Character) => {
          // Access wallTemperament through a global context or state management
          // For now, this is handled in the component logic
          return true;
        }
      },
      { 
        text: 'Continue with high temperament', 
        nextNodeId: '17', 
        condition: (character: Character) => {
          // Access wallTemperament through a global context or state management
          // For now, this is handled in the component logic
          return true;
        }
      }
    ]
  },
  '20': {
    id: '20',
    title: 'Correct Button Sequence!',
    content: 'You press the buttons in sequence: first clouds, then waves, and finally trees.\n\nAs your finger leaves the final button, you hear a deep rumbling sound. The mountain itself seems to shudder. You hold your breath, watching as the smooth rectangle in the mountainside slowly begins to move. With the grinding of stone against stone, the door slides sideways, revealing a dark tunnel that descends beneath the mountain.',
    choices: [
      { text: 'Descend into the dungeon', nextNodeId: '41' },
      { text: 'Go back home', nextNodeId: '73' }
    ]
  },
  '21': {
    id: '21',
    title: 'Golden Door',
    content: 'You walk over to the door and see it is made of solid gold. A lock and handle are halfway down the right side of it.',
    choices: [
      { text: 'Try the handle', nextNodeId: '10' },
      { text: 'Inspect the sarcophagus', nextNodeId: '86' }
    ]
  },
  '22': {
    id: '22',
    title: 'Incorrect Button Sequence - Clouds, Trees, Waves',
    content: 'You press the clouds button first, then trees, and finally waves. The buttons click down satisfyingly, but nothing happens. After a brief moment, they all pop back up with a dull thunk.\n\nThe mountain remains silent, the doorway unmoved. This was not the correct sequence.',
    choices: [
      { text: 'Try another combination', nextNodeId: '42' }
    ]
  },
  '23': {
    id: '23', 
    title: 'Get Back to Business',
    content: '"Speaking of which, I have a job to do."',
    choices: [
      { text: 'Continue', nextNodeId: '7' }
    ]
  },
  '24': {
    id: '24',
    title: 'Examine the Face',
    content: 'You walk over to the east wall to get a closer look at the face.\n\nThe face is intricately carved and well detailed; the eyebrows are furrowed; age and experience are suggested by multiple wrinkles and scars, and a great big bushy beard covers the lower half.\n\nIts eyes are tightly shut, and its mouth is open a fraction on the left as if it were asleep.',
    choices: [
      { text: 'Shout at the face', nextNodeId: '92' },
      { text: 'Poke its eye', nextNodeId: '2' },
      { text: 'Caress its cheek', nextNodeId: '50' }
    ]
  },
  '26': {
    id: '26',
    title: 'Apologize for Poking',
    content: 'You see the rage on the door\'s face and say: "I\'m so sorry, to be honest, I didn\'t think anything would happen."\n\nThe door looks you over and says: "Yes, well, something did, but you strike me as having not encountered many talking walls before, so apology accepted."\n\nSubtract 1 from your Wall Temperament score.',
    choices: [
      { text: 'Continue', nextNodeId: '98', wallEffect: -1 }
    ]
  },
  '27': {
    id: '27',
    title: 'Skeleton Guardian',
    content: 'You knock on the lid of the coffin. A few moments pass with nothing happening. Then, stone screeches against stone as the lid starts to move to the side.\n\nOut of the sarcophagus steps a skeleton with a golden key hung around its neck and a sword in hand. Its jaw starts to move, and despite its lack of lungs, it sighs, then speaks to you in a wispy voice.\n\nIt says: "So you are the latest challenger, eh? I was once just like you. It took all my power to get here."\n\n"Don\'t be thinking this will be easy, mind. This sword isn\'t just for show," it screams as it lunges towards you.',
    choices: [
      {
        text: 'Fight the skeleton',
        action: 'startCombat',
        enemy: {
          name: 'Skeleton',
          skill: 9,
          stamina: 13,
          currentStamina: 13
        },
        nextNodeId: ''
      }
    ]
  },
  '28': {
    id: '28',
    title: 'Wall Romance Ending',
    content: 'You come to the room of the talking wall, and talk for what seems an age. You find you two have a lot in common.\n\nYou decide to make something of it together, supporting one another in a dark, cruel world.\n\nThe wall informs you that the treasure was cursed, and should you have claimed any of it, you would have become the new skeleton in the sarcophagus.\n\nThe years pass. Occasionally you have to hide when some would-be adventurer comes to claim the cursed treasure. Whenever you do, you smile, knowing you have the greatest treasure of them all: true love.\n\nCongratulations! You have completed The Five Room Dungeon adventure with the Wall Romance ending!',
    choices: [
      { text: 'Play again', nextNodeId: '1', action: 'reset' }
    ]
  },
  '30': {
    id: '30',
    title: 'Wall Helps You',
    content: '"His skeletal remains are in the room beyond. I can see you are a sweetheart, so I\'m going to skip the morality test and open it up for you."\n\nYou hear the scraping of stone and, turning around, you see the west wall opens up, revealing another corridor.\n\nBehind you, the wall says: "If you survive, maybe come back and say hi?"',
    choices: [
      { text: 'Continue', nextNodeId: '67' }
    ]
  },
  '31': {
    id: '31',
    title: 'Don\'t Know',
    content: 'You tell the face: "To tell the truth, I\'ve not thought that far ahead."\n\nThe face sizes you up and says: "I can believe that."',
    choices: [
      { text: 'Continue', nextNodeId: '63' }
    ]
  },
  '32': {
    id: '32',
    title: 'Keep Potion',
    content: 'You place the potion in your backpack. It may well come in handy later. Add "Potion of Healing" to your adventure sheet.',
    choices: [
      { text: 'Continue', nextNodeId: '88' }
    ],
    effect: (character: Character, inventory: string[]): NodeEffect => ({
      character,
      inventory: [...inventory, 'Potion of Healing']
    })
  },
  '33': {
    id: '33',
    title: 'Rogue Innuendo',
    content: 'The face looks you over, noting your Rogue\'s equipment, and says: "Are those two daggers in your breeches or are you just pleased to see me?"',
    choices: [
      { text: 'Be literal', nextNodeId: '44' },
      { text: 'Play along', nextNodeId: '4' }
    ]
  },
  '34': {
    id: '34',
    title: 'Knife Encounter',
    content: 'The table is small and of wooden construction. Resting on top of it, you see a kitchen knife, a brass key, and a glass bottle filled with red liquid.\n\nAs your hand reaches out towards the table, the knife suddenly springs to life, flying at your face!',
    choices: [
      {
        text: 'Fight the animated knife',
        action: 'startCombat',
        enemy: {
          name: 'Animated Knife',
          skill: 8,
          stamina: 12,
          currentStamina: 12
        },
        nextNodeId: ''
      }
    ]
  },
  '35': {
    id: '35',
    title: 'Deflect After Shouting',
    content: 'You look at the face and with a grin say: "Well if not eggs and bacon, could I interest you in some pebbles?"\n\nThe face narrows its eyes and says: "I don\'t care for pebbles, or your attempts at humor."\n\nAdd 1 to your Wall Temperament score.',
    choices: [
      { text: 'Continue', nextNodeId: '98', wallEffect: 1 }
    ]
  },
  '36': {
    id: '36',
    title: 'Incorrect Button Sequence - Trees, Waves, Clouds',
    content: 'Starting with trees, then waves, and finally clouds, you press each button firmly. They stay down momentarily, but then all three pop back up at once, accompanied by a faint rumbling that quickly fades.\n\nThe door doesn\'t budge. It seems this sequence isn\'t correct either.',
    choices: [
      { text: 'Try another combination', nextNodeId: '42' }
    ]
  },
  '37': {
    id: '37',
    title: 'Sarcophagus Room',
    content: 'Having spoken to the wall, you push on deeper into the dungeon...\n\nThe passageway opens up, revealing a large chamber. In the center is a stone sarcophagus. On the east wall is a door that reflects the light of your torch in a warm gold.',
    choices: [
      { text: 'Examine the sarcophagus', nextNodeId: '86' },
      { text: 'Look at the door', nextNodeId: '21' }
    ]
  },
  '38': {
    id: '38',
    title: 'First Chamber',
    content: 'The tunnel goes on for 40 feet before opening up to a small chamber. On the south wall is a door, and in the middle of the room is a table.',
    choices: [
      { text: 'Examine the door', nextNodeId: '48' },
      { text: 'Inspect the table', nextNodeId: '34' }
    ]
  },
  '39': {
    id: '39',
    title: 'Inspect Potion',
    content: 'You pick up the bottle and, turning it over in your hand, you see written on the base of it the words "Potion of Healing."',
    choices: [
      { text: 'Put it in your backpack', nextNodeId: '32' },
      { text: 'Drink it now', nextNodeId: '11' }
    ]
  },
  '40': {
    id: '40',
    title: 'Incorrect Button Sequence - Waves, Clouds, Trees',
    content: 'You press the waves button first, followed by clouds, and then trees. Each button makes a clicking sound as you press it, but the sequence appears to be incorrect. After a moment, all three buttons pop back up simultaneously.\n\nThe door remains stubbornly closed. Perhaps another combination would work?',
    choices: [
      { text: 'Try another combination', nextNodeId: '42' }
    ]
  },
  '41': {
    id: '41',
    title: 'First Chamber Alt',
    content: 'The tunnel goes on for 40 feet before opening up to a small chamber. On the south wall is a door, and in the middle of the room is a table.',
    choices: [
      { text: 'Examine the door', nextNodeId: '48' },
      { text: 'Inspect the table', nextNodeId: '34' }
    ]
  },
  '42': {
    id: '42',
    title: 'The Buttons Puzzle',
    content: 'Taking a moment to survey the area, a patch of stone of a lighter grey than the rest of the mountain catches your eye just off to the left.\n\nThree raised buttons adorn the top of the light grey slab, each with a different symbol carved into it: the first trees, the second waves, and the last clouds.\n\nBeneath the drawings are carved these words: "The world was formed of three parts. Choose the order in which the parts came to be to reveal the entrance."',
    choices: [
      { text: 'Press: clouds, waves, trees', nextNodeId: '20' },
      { text: 'Press: clouds, trees, waves', nextNodeId: '22' },
      { text: 'Press: waves, clouds, trees', nextNodeId: '40' },
      { text: 'Press: waves, trees, clouds', nextNodeId: '85' },
      { text: 'Press: trees, clouds, waves', nextNodeId: '6' },
      { text: 'Press: trees, waves, clouds', nextNodeId: '36' }
    ]
  },
  '43': {
    id: '43',
    title: 'Corridor to Face',
    content: 'Lighting another torch, you journey onwards, deeper into the dungeon.\n\nYou walk on through the corridor until it eventually opens out into a circular chamber. Carved onto the east wall is a face.',
    choices: [
      { text: 'Pack in and leave the dungeon', nextNodeId: '73' },
      { text: 'Examine the face', nextNodeId: '24' }
    ]
  },
  '44': {
    id: '44',
    title: 'Rogue Literal Response',
    content: 'You are a Rogue, so you look from the face to your daggers and say: "I prefer the term stiletto, but same difference."',
    choices: [
      { text: 'Continue', nextNodeId: '52' }
    ]
  },
  '48': {
    id: '48',
    title: 'First Door',
    content: 'The door is made of solid wood, halfway down the right-hand side is a brass lock and handle.',
    choices: [
      { text: 'Try the handle', nextNodeId: '77' },
      { text: 'Inspect the table instead', nextNodeId: '34' }
    ]
  },
  '50': {
    id: '50',
    title: 'Caress the Face',
    content: 'You run your hand gently across the bearded cheek of the carving. It moves beneath your fingers, and you see the eyes flutter open, fixing on you.\n\nThe face speaks in a gravelly voice, saying: "Why hello there handsome."',
    choices: [
      { 
        text: 'Continue as Fighter', 
        nextNodeId: '90', 
        condition: (character: Character) => character.type === 'Fighter' 
      },
      { 
        text: 'Continue as Rogue', 
        nextNodeId: '33', 
        condition: (character: Character) => character.type === 'Rogue' 
      },
      { 
        text: 'Continue as Wizard', 
        nextNodeId: '14', 
        condition: (character: Character) => character.type === 'Wizard' 
      }
    ]
  },
  '52': {
    id: '52',
    title: 'Lackluster Response',
    content: 'The face looks at you blankly and says: "Oh. Cool."\n\nAdd 1 to your Wall Temperament score.',
    choices: [
      { text: 'Continue', nextNodeId: '98', wallEffect: 1 }
    ]
  },
  '54': {
    id: '54',
    title: 'Take the Treasure',
    content: 'You reach out your hand and start loading jewels and coins into your backpack.\n\nYou keep looting until you notice a tingle in your hands. Looking down, you see that the flesh starts to peel away from them.\n\nYou start to scream, but soon even your breath is taken from you, and all becomes darkness...\n\nEventually, you come back to consciousness to the sound of stone scraping against stone. A smidgen of light slowly eeks out above your head, revealing an opening.\n\nLifting your head up, you see you are in a large chamber with a golden door to the side and the face of a plucky adventurer in front of you.\n\nWith a sigh, you step out of the sarcophagus and finally understand why no one ever comes back from the five room dungeon.\n\nYour adventure is over, but your curse has just begun.',
    choices: [
      { text: 'Play again', nextNodeId: '1', action: 'reset' }
    ]
  },
  '55': {
    id: '55',
    title: 'Ask About the Face',
    content: 'You say to the wall: "I\'m just exploring, but what about you - what\'s your story?"\n\nThe wall looks bashful and replies: "Why, no one ever asks about me. Oh my!"\n\n"I was constructed by the mage who built this dungeon to test the morality of those who enter in."\n\nSubtract 1 from your Wall Temperament score.',
    choices: [
      { text: 'Continue', nextNodeId: '23', wallEffect: -1, condition: (character: Character) => true },
      { text: 'Continue', nextNodeId: '30', wallEffect: -1, condition: (character: Character) => true }
    ],
    effect: (character: Character, inventory: string[]): NodeEffect => ({
      character,
      inventory,
      wallTemperament: -1
    })
  },
  '60': {
    id: '60',
    title: 'Help Others',
    content: 'You tell the face: "I plan to use the treasure to help out my village."\n\nThe face sizes you up and says: "A most noble endeavor."\n\nSubtract 1 from your Wall Temperament score.',
    choices: [
      { text: 'Continue', nextNodeId: '63', wallEffect: -1 }
    ]
  },
  '61': {
    id: '61',
    title: 'Wall Conversation Alt',
    content: 'The face says: "Well, you\'ve woken me up. What can I do you for?"',
    choices: [
      { text: 'State your business', nextNodeId: '7' },
      { text: 'Ask about the face', nextNodeId: '55' }
    ]
  },
  '63': {
    id: '63',
    title: 'Wall\'s Judgment',
    content: 'The face considers your answer carefully.',
    choices: [
      { 
        text: 'Continue with high temperament', 
        nextNodeId: '41', 
        condition: (character: Character) => true
      },
      { 
        text: 'Continue with medium temperament', 
        nextNodeId: '12', 
        condition: (character: Character) => true
      },
      { 
        text: 'Continue with low temperament', 
        nextNodeId: '8', 
        condition: (character: Character) => true
      }
    ]
  },
  '66': {
    id: '66',
    title: 'Inspect Potion Again',
    content: 'You pick up the bottle and, turning it over in your hand, you see written on the base of it the words "Potion of Healing."',
    choices: [
      { text: 'Put it in your backpack', nextNodeId: '82' },
      { text: 'Drink it now', nextNodeId: '11' }
    ]
  },
  '67': {
    id: '67',
    title: 'Proceed to Sarcophagus Room',
    content: 'You proceed down the corridor that the wall has revealed.',
    choices: [
      { text: 'Sally forth into the corridor', nextNodeId: '37' },
      { text: 'Go back home', nextNodeId: '73' }
    ]
  },
  '68': {
    id: '68',
    title: 'Lackluster Response Alt',
    content: 'The face looks at you blankly and says: "Oh. Cool."\n\nAdd 1 to your Wall Temperament score.',
    choices: [
      { text: 'Continue', nextNodeId: '61', wallEffect: 1 }
    ]
  },
  '69': {
    id: '69',
    title: 'Use Key on First Door',
    content: 'You walk over to the door and try the key in the lock. It fits, and you turn the handle, opening the door and revealing a corridor that extends on for at least 40 feet.',
    choices: [
      { text: 'Walk into the corridor', nextNodeId: '43' },
      { text: 'Flee the dungeon in terror', nextNodeId: '73' }
    ]
  },
  '72': {
    id: '72',
    title: 'Apologize for Shouting',
    content: 'You see the rage on the door\'s face and say: "I\'m so sorry, to be honest, I didn\'t think anything would happen."\n\nThe door looks you over and says: "Yes, well, something did, but you strike me as having not encountered many talking walls before, so apology accepted."\n\nSubtract 1 from your Wall Temperament score.',
    choices: [
      { text: 'Continue', nextNodeId: '98', wallEffect: -1 }
    ]
  },
  '73': {
    id: '73',
    title: 'Game Over',
    content: 'For many a year will tale be told of how you gave up on your epic quest, never to fulfill your destiny.',
    choices: [
      { text: 'Start over', nextNodeId: '1', action: 'reset' }
    ]
  },
  '74': {
    id: '74',
    title: 'Bender Plans',
    content: 'You tell the face: "Get me some shiny rings, few barrels of mead, and hit the brothels!"\n\nThe face sizes you up and says: "I see."\n\nAdd 1 to your Wall Temperament score.',
    choices: [
      { text: 'Continue', nextNodeId: '63', wallEffect: 1 }
    ]
  },
  '77': {
    id: '77',
    title: 'Locked First Door',
    content: 'You turn the handle, but the door remains locked, and you currently have no means of changing that.',
    choices: [
      { text: 'Go back', nextNodeId: '38' }
    ]
  },
  '78': {
    id: '78',
    title: 'Wall Romance Ending Alt',
    content: 'You come to the room of the talking wall, and talk for what seems an age. You find you two have a lot in common.\n\nYou decide to make something of it together, supporting one another in a dark, cruel world.\n\nThe wall informs you that the treasure was cursed, and should you have claimed any of it, you would have become the new skeleton in the sarcophagus.\n\nThe years pass. Occasionally you have to hide when some would-be adventurer comes to claim the cursed treasure. Whenever you do, you smile, knowing you have the greatest treasure of them all: true love.\n\nCongratulations! You have completed The Five Room Dungeon adventure with the Wall Romance ending!',
    choices: [
      { text: 'Play again', nextNodeId: '1', action: 'reset' }
    ]
  },
  '82': {
    id: '82',
    title: 'Keep Potion Alt',
    content: 'You place the potion in your backpack. It may well come in handy later. Add "Potion of Healing" to your adventure sheet.',
    choices: [
      { text: 'Continue', nextNodeId: '69' }
    ],
    effect: (character: Character, inventory: string[]): NodeEffect => ({
      character,
      inventory: [...inventory, 'Potion of Healing']
    })
  },
  '83': {
    id: '83',
    title: 'Wizard Literal Response',
    content: 'You are a Wizard, so you look from the face to your wand and say: "Affirmative. I use it to cast spells of a rad nature."',
    choices: [
      { text: 'Continue', nextNodeId: '68' }
    ]
  },
  '85': {
    id: '85',
    title: 'Incorrect Button Sequence - Waves, Trees, Clouds',
    content: 'Pressing waves first, then trees, and finally clouds, you wait expectantly. The buttons stay depressed for a moment, then spring back up with a hollow sound that echoes against the mountainside.\n\nWhatever mechanism controls the door remains inactive. You\'ll need to try a different sequence.',
    choices: [
      { text: 'Try another combination', nextNodeId: '42' }
    ]
  },
  '86': {
    id: '86',
    title: 'Examine Sarcophagus',
    content: 'You move over to the center of the room and see that the sarcophagus is covered in sigils and runes.\n\nIf you are a Wizard, from your years of study, you know these symbols pertain to necromancy and chronomancy.',
    choices: [
      { text: 'Knock on the lid', nextNodeId: '27' },
      { text: 'Look at the door', nextNodeId: '21' },
      { text: 'Flee the dungeon', nextNodeId: '73' }
    ]
  },
  '88': {
    id: '88',
    title: 'Use Key on First Door Alt',
    content: 'You walk over to the door and try the key in the lock. It fits, and you turn the handle, opening the door and revealing a corridor that extends on for at least 40 feet.',
    choices: [
      { text: 'Walk into the corridor', nextNodeId: '43' },
      { text: 'Flee the dungeon in terror', nextNodeId: '73' }
    ]
  },
  '90': {
    id: '90',
    title: 'Fighter Innuendo',
    content: 'The face looks you over, eying your Fighter\'s sword, and says: "Is that a sword in your sheath or are you just pleased to see me?"',
    choices: [
      { text: 'Be literal', nextNodeId: '5' },
      { text: 'Play along', nextNodeId: '4' }
    ]
  },
  '91': {
    id: '91',
    title: 'Double Down After Shouting',
    content: 'You look at the face and say: "You\'re a wall carving, I don\'t owe you jack."\n\nThe face looks you up and down and says: "You\'re a bag of bones - right back at you, pal."\n\nAdd 2 to your Wall Temperament score.',
    choices: [
      { text: 'Continue', nextNodeId: '98', wallEffect: 2 }
    ],
    effect: (character: Character, inventory: string[]): NodeEffect => ({
      character,
      inventory,
      wallTemperament: 2
    })
  },
  '92': {
    id: '92',
    title: 'Shout at Face',
    content: 'Breathing in to achieve maximum volume, you unleash a bellowing cry of:\n\n"WAKEY WAKEY EGGS AND BAKEY GOOD MORNING MR. WALL-FACE!"\n\nYour scream shakes the very foundations of the chamber. The eyes of the face open blinkingly, accompanied by the sound of grinding stone.\n\nThe face speaks in a gravelly voice, saying: "Three things: first - rude! Second - do I look like I need eggs or bacon to you? Third - real fucking rude!"\n\nAdd 2 to your Wall Temperament score.',
    choices: [
      { text: 'Apologize', nextNodeId: '72', wallEffect: -1 },
      { text: 'Deflect', nextNodeId: '96', wallEffect: 1 },
      { text: 'Double down', nextNodeId: '91', wallEffect: 2 }
    ],
    effect: (character: Character, inventory: string[]): NodeEffect => ({
      character,
      inventory,
      wallTemperament: 2
    })
  },
  '96': {
    id: '96',
    title: 'Deflect Response',
    content: 'You look at the face and with a grin say: "Well if not eggs and bacon, could I interest you in some pebbles?"\n\nThe face narrows its eyes and says: "I don\'t care for pebbles, or your attempts at humor."',
    choices: [
      { text: 'Continue', nextNodeId: '98', wallEffect: 1 }
    ]
  },
  '98': {
    id: '98',
    title: 'Wall Conversation',
    content: 'The face says: "Well, you\'ve woken me up. What can I do you for?"',
    choices: [
      { text: 'State your business', nextNodeId: '7' },
      { text: 'Ask about the face', nextNodeId: '55' }
    ]
  }
};