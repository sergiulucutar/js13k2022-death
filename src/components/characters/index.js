const names = [
  'Dorothy',
  'Mildred',
  'Mary',
  'Anna',
  'Mary',
  'Helen',
  'Margaret',
  'John',
  'Charles',
  'Edward',
  'Robert',
  'William',
  'Frank',
  'Thomas'
];

const families = [
  {
    name: 'Crow'
  },
  {
    name: 'Badger'
  },
  {
    name: 'Stag'
  },
  {
    name: 'Otter'
  },
  {
    name: 'Trout'
  },
  {
    name: 'Lamb'
  }
];

const tags = {
  DEAD: 'dead',
  ALIVE: 'alive'
};

const powers = [
  {
    id: 1,
    text: '+3 ink',
    tag: tags.DEAD
  },
  {
    id: 2,
    text: 'vowels cost no ink',
    tag: tags.DEAD
  },
  {
    id: 3,
    text: '50% to drop a memory tag',
    tag: tags.DEAD
  },
  {
    id: 4,
    text: 'each kill +1 ink',
    tag: tags.DEAD
  },
  {
    id: 5,
    text: 'on kill, tag another character with "killer" tag',
    tag: tags.ALIVE
  },
  {
    id: 6,
    text: 'each kill +1 ink',
    tag: tags.ALIVE
  },
  {
    id: 7,
    text: '50% change to drop a memory',
    tag: tags.ALIVE
  },
  {
    id: 8,
    text: 'each revive +1 ink',
    tag: tags.ALIVE
  },
  {
    id: 9,
    text: '+1 ink for each person alive',
    tag: tags.DEAD
  }
];

class Characters {
  constructor(game) {
    this.game = game;
    this.renderer = new CharactersRenderer();
  }

  init() {
    this.selectedFamilies = this._selectFamilies();

    this.characters = [];
    let auxNames = [...names];
    for (let i = 0; i < 9; i++) {
      const randomName = Utils.random(0, auxNames.length - 1);
      const randomFamily = Utils.random(0, this.selectedFamilies.length - 1);
      const character = {
        name: auxNames[randomName],
        family: this.selectedFamilies[randomFamily].name,
        isDead: false,
        power: powers[i]
      };
      auxNames = auxNames.filter(n => n !== character.name);
      this.characters.push(character);
    }
  }

  render(poemHtml) {
    this.renderer.render(this.characters, poemHtml);
  }

  tagKiller() {
    const aliveCharacters = this.characters.filter(char => !char.isDead);
    const randomIndex = Utils.random(0, aliveCharacters.length);
    aliveCharacters[randomIndex].isKiller = true;
    this.renderer.setKiller(aliveCharacters[randomIndex]);
  }

  _selectFamilies(count = 3) {
    const selectedFamilies = [];
    let auxFamilies = [...families];
    for (let i = 0; i < count; i++) {
      const selectedFamily =
        auxFamilies[Utils.random(0, auxFamilies.length - 1)];
      selectedFamilies.push(selectedFamily);
      auxFamilies = auxFamilies.filter(family => family !== selectedFamily);
    }

    return selectedFamilies;
  }

  revealFirstName(character) {
    this.renderer.revealFirstName(character);
  }

  revealFamilyName(character) {
    this.renderer.revealFamilyName(character);
  }

  showDead(character) {
    this.renderer.showDead(character);
  }
}
