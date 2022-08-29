const charactersEl = document.querySelector('.characters__wrapper');

class CharactersRenderer {
  render(characters, poemHtml = '') {
    let html = '';
    characters.forEach((character, index) => {
      if (index === Math.floor(characters.length / 2)) {
        html += poemHtml;
      }

      html += `
      <div class="card character" data-characterName="${character.name}">
        <div class="character__portrait"></div>
        <div class="character__name"><span>???</span> <span>???</span></div>
      </div>`;
    });
    charactersEl.innerHTML = html;
  }

  revealFirstName(character) {
    const characterEl = this._getCharacterEl(character);
    const firstNameEl = characterEl.querySelector(
      '.character__name span:first-child'
    );

    firstNameEl.innerText = character.name;
  }

  revealFamilyName(character) {
    const characterEl = this._getCharacterEl(character);
    const familyNameEl = characterEl.querySelector(
      '.character__name span:last-child'
    );

    familyNameEl.innerText = character.family;
  }

  showDead(character) {
    const characterEl = this._getCharacterEl(character);
    characterEl.classList.add('character--dead');
  }

  _getCharacterEl(character) {
    return document.querySelector(`[data-charactername="${character.name}"]`);
  }
}
