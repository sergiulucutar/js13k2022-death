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
        isDead: false
      };
      auxNames = auxNames.filter(n => n !== character.name);
      this.characters.push(character);
    }
  }

  render(poemHtml) {
    this.renderer.render(this.characters, poemHtml);
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
