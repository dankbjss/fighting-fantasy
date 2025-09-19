# 5e api

## Race

Command:
```bash
curl -X GET "https://www.dnd5eapi.co/api/2014/races/dwarf" -H "Accept: application/json" | jq
```

Output:
```json
{
  "index": "dwarf",
  "name": "Dwarf",
  "speed": 25,
  "ability_bonuses": [
    {
      "ability_score": {
        "index": "con",
        "name": "CON",
        "url": "/api/2014/ability-scores/con"
      },
      "bonus": 2
    }
  ],
  "alignment": "Most dwarves are lawful, believing firmly in the benefits of a well-ordered society. They tend toward good as well, with a strong sense of fair play and a belief that everyone deserves to share in the benefits of a just order.",
  "age": "Dwarves mature at the same rate as humans, but they're considered young until they reach the age of 50. On average, they live about 350 years.",
  "size": "Medium",
  "size_description": "Dwarves stand between 4 and 5 feet tall and average about 150 pounds. Your size is Medium.",
  "starting_proficiencies": [
    {
      "index": "battleaxes",
      "name": "Battleaxes",
      "url": "/api/2014/proficiencies/battleaxes"
    },
    {
      "index": "handaxes",
      "name": "Handaxes",
      "url": "/api/2014/proficiencies/handaxes"
    },
    {
      "index": "light-hammers",
      "name": "Light hammers",
      "url": "/api/2014/proficiencies/light-hammers"
    },
    {
      "index": "warhammers",
      "name": "Warhammers",
      "url": "/api/2014/proficiencies/warhammers"
    }
  ],
  "starting_proficiency_options": {
    "desc": "You gain proficiency with the artisan’s tools of your choice: smith’s tools, brewer’s supplies, or mason’s tools.",
    "choose": 1,
    "type": "proficiencies",
    "from": {
      "option_set_type": "options_array",
      "options": [
        {
          "option_type": "reference",
          "item": {
            "index": "smiths-tools",
            "name": "Smith's Tools",
            "url": "/api/2014/proficiencies/smiths-tools"
          }
        },
        {
          "option_type": "reference",
          "item": {
            "index": "brewers-supplies",
            "name": "Brewer's Supplies",
            "url": "/api/2014/proficiencies/brewers-supplies"
          }
        },
        {
          "option_type": "reference",
          "item": {
            "index": "masons-tools",
            "name": "Mason's Tools",
            "url": "/api/2014/proficiencies/masons-tools"
          }
        }
      ]
    }
  },
  "languages": [
    {
      "index": "common",
      "name": "Common",
      "url": "/api/2014/languages/common"
    },
    {
      "index": "dwarvish",
      "name": "Dwarvish",
      "url": "/api/2014/languages/dwarvish"
    }
  ],
  "language_desc": "You can speak, read, and write Common and Dwarvish. Dwarvish is full of hard consonants and guttural sounds, and those characteristics spill over into whatever other language a dwarf might speak.",
  "traits": [
    {
      "index": "darkvision",
      "name": "Darkvision",
      "url": "/api/2014/traits/darkvision"
    },
    {
      "index": "dwarven-resilience",
      "name": "Dwarven Resilience",
      "url": "/api/2014/traits/dwarven-resilience"
    },
    {
      "index": "stonecunning",
      "name": "Stonecunning",
      "url": "/api/2014/traits/stonecunning"
    },
    {
      "index": "dwarven-combat-training",
      "name": "Dwarven Combat Training",
      "url": "/api/2014/traits/dwarven-combat-training"
    },
    {
      "index": "tool-proficiency",
      "name": "Tool Proficiency",
      "url": "/api/2014/traits/tool-proficiency"
    }
  ],
  "subraces": [
    {
      "index": "hill-dwarf",
      "name": "Hill Dwarf",
      "url": "/api/2014/subraces/hill-dwarf"
    }
  ],
  "url": "/api/2014/races/dwarf",
  "updated_at": "2025-03-10T16:58:38.947Z"
}
```

## filter out trait


Command:
```bash
curl -X GET "https://www.dnd5eapi.co/api/2014/traits/dwarven-combat-training" -H "Accept: application/json" | \
jq '{
    name: .name, 
    description: .desc[],
    proficiencies: [.proficiencies[].name]
}'
```

Output:
```json
{
  "name": "Dwarven Combat Training",
  "description": "You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.",
  "proficiencies": [
    "Battleaxes",
    "Handaxes",
    "Light hammers",
    "Warhammers"
  ]
}
```

## filter out ability bonuses

Command: 
```bash
curl -X GET "https://www.dnd5eapi.co/api/2014/races/dwarf" -H "Accept: application/json" | \
jq '{ 
    abilityBonuses: [ 
        { name: .ability_bonuses[].ability_score.name, bonus: .ability_bonuses[].bonus }
    ] 
}'
```

Output
```json
{
  "abilityBonuses": [
    {
      "name": "CON",
      "bonus": 2
    }
  ]
}
```

## so far

Command (raw):
```bash
curl -X GET "https://www.dnd5eapi.co/api/2014/races/dwarf" -H "Accept: application/json" | jq '{ name: .name, speed: .speed, abilityBonuses: [ { name: .ability_bonuses[].ability_score.name, bonus: .ability_bonuses[].bonus} ], alignment: .alignment, age: .age, size: .size, sizeDescription: .size_description, startingProficiencies: [ .starting_proficiencies[].name ], startingProficiencyOptions: { description: .starting_proficiency_options.desc, options: [ .starting_proficiency_options.from.options[].item.name ] }, languages: [ .languages[].name ], languageDescription: .language_desc }'       
```

Command (pretty):
```bash
curl -X GET "https://www.dnd5eapi.co/api/2014/races/dwarf" -H "Accept: application/json" | \ 
jq '{ 
    name: .name, 
    speed: .speed, 
    abilityBonuses: [ { name: .ability_bonuses[].ability_score.name, bonus: .ability_bonuses[].bonus } ], 
    alignment: .alignment, 
    age: .age, 
    size: .size, 
    sizeDescription: .size_description,
    startingProficiencies: [ .starting_proficiencies[].name ],
    startingProficiencyOptions: { 
        description: .starting_proficiency_options.desc, 
        options: [ .starting_proficiency_options.from.options[].item.name ] 
    },
    languages: [ .languages[].name ], 
    languageDescription: .language_desc
}'
```

Ouput:
```json
{
  "name": "Dwarf",
  "speed": 25,
  "abilityBonuses": [
    {
      "name": "CON",
      "bonus": 2
    }
  ],
  "alignment": "Most dwarves are lawful, believing firmly in the benefits of a well-ordered society. They tend toward good as well, with a strong sense of fair play and a belief that everyone deserves to share in the benefits of a just order.",
  "age": "Dwarves mature at the same rate as humans, but they're considered young until they reach the age of 50. On average, they live about 350 years.",
  "size": "Medium",
  "sizeDescription": "Dwarves stand between 4 and 5 feet tall and average about 150 pounds. Your size is Medium."
  "startingProficiencies": [
    "Battleaxes",
    "Handaxes",
    "Light hammers",
    "Warhammers"
  ],  
  "startingProficiencyOptions": {
    "description": "You gain proficiency with the artisan’s tools of your choice: smith’s tools, brewer’s supplies, or mason’s tools.",
    "options": [
      "Smith's Tools",
      "Brewer's Supplies",
      "Mason's Tools"
    ]
  },
  "languages": [
    "Common",
    "Dwarvish"
  ],
  "languageDescription": "You can speak, read, and write Common and Dwarvish. Dwarvish is full of hard consonants and guttural sounds, and those characteristics spill over into whatever other language a dwarf might speak."

}
```
