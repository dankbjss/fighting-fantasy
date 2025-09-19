import { Enemy } from "./model";

export type NodeKey = keyof typeof nodes;

export const nodes: Record<string, {
    title: string;
    content: string;
    successNode?: string;
    failureNode?: string;
    choices?: { text: string; next: NodeKey }[];
    action?: string;
    enemies?: Enemy[];
  }> = {
    start: {
      title: "Character Creation",
      content: "Before beginning your adventure, you must determine your initial abilities.",
      action: "rollCharacter",
      choices: [
        { text: "Continue", next: "background" }
      ]
    },
    background: {
      title: "Caverns of the Snow Witch",
      content: "Winters in northern Allansia are always cruel and bitter. The snow falls thick and the icy wind blows hard, chilling everybody to the bone.",
      choices: [
        { text: "Begin your adventure", next: "node1"}
      ]
    },
    gameOver: {
      title: "You Have Fallen",
      content: "You were defeated in battle. The adventure ends here.",
      choices: [
        { text: "Restart", next: "start" }
      ]
    },
    node1: {
      title: "The Trek Begins",
      content: "By the time you reach the outpost again, the bodies are blanketed with snow and the beast's footprints are covered over. You soon find yourself at the edge of a crevasse which is spanned by an ice bridge.",
      choices: [
        { text: "Cross the crevasse by the ice bridge", next: "node2" },
        { text: "Walk around the crevasse", next: "node4" }
      ]
    },
    node2: {
        title: "Twin Yetis",
        content: "As you cross the bridge, you are ambushed by two howling Yetis!",
        action: "combat",
        successNode: "node41",
        choices: [
          { text: "Fight!", next: "combat" }
        ],
        enemies: [
          { name: "Yeti One", skill: 8, stamina: 10 },
          { name: "Yeti Two", skill: 7, stamina: 8 }
        ]
    },
    node41: {
      title: "Victory Over the Twin Yetis",
      content: "You have defeated the twin Yetis! Their howls fade into silence as you stand victorious.",
      choices: [
        { text: "Continue your journey", next: "node1" }
      ]
    },
    node4: {
        title: "Around the Crevasse",
        content: "As you walk along the edge of the crevasse, you encounter a huge mammoth!",
        action: "combat",
        successNode: "node47",
        choices: [
          { text: "Fight the mammoth", next: "combat" }
        ],
        enemies: [{ name: "Mammoth", skill: 9, stamina: 12 }]
      },
    node47: {
      title: "Victory Over the Mammoth",
      content: "The mammoth collapses with a thunderous crash. You have triumphed over the beast!",
      choices: [
        { text: "Continue your journey", next: "node1" }
      ]
    },
    node389: {
      title: "Unlucky!",
      content: "You slip on the ice bridge and barely manage to hang on!",
      choices: [
        { text: "Try to climb back up", next: "node1" }
      ]
    },
  };