const charactersEl = document.querySelector('.characters__wrapper');

class CharacterRenderer {
  renderAll(characters) {
    charactersEl.innerHTML = this.getCharactersHTML(characters);
  }

  renderNew(character) {
    const auxDiv = document.createElement('div');
    auxDiv.innerHTML = this._getCharacterHtml(character);
    charactersEl.appendChild(auxDiv.children[0]);
  }

  renderWorkerShop(characters) {
    shopWorkerEl.innerHTML = this.getCharactersHTML(characters);
  }

  getCharactersHTML(characters) {
    let html = '';
    characters.forEach(character => {
      html += this._getCharacterHtml(character);
    });
    return html;
  }

  update(character) {
    const el = this._getCharacterEl(character);
    character.abilities.forEach(({ consume, produce }, index) => {
      if (consume) {
        el.querySelector(
          `.ability_phase:nth-child(${index + 1}) .essence__value--consume`
        ).innerText = consume.value;
      }
      if (produce) {
        const produceEl = el.querySelector(
          `.ability_phase:nth-child(${index + 1}) .essence__value--produce`
        );
        if (produceEl) {
          produceEl.innerText = produce.value;
        }
      }
    });

    if (character.isDead) {
      el.classList.add('character--dead');
    } else {
      el.classList.remove('character--dead');
    }
  }

  _getCharacterEl(character) {
    return document.querySelector(`[data-characterid="${character.id}"]`);
  }

  _getCharacterHtml(character) {
    let abilityHtml = '';
    for (let i = 0; i < 3; i++) {
      const ability = character.abilities[i];
      abilityHtml += '<div class="ability_phase">';
      if (ability && ability.consume) {
        abilityHtml += `
        <div class="essence"><span class="essence__type"><span class="heart">${this._getIcon(
          ability.consume.type
        )}</span></span> <span class="essence__value--consume">${
          ability.consume.value
        }</span></div>
        `;
      }
      if (ability && (ability.consume || ability.produce)) {
        abilityHtml += '<span class="ability_phase__operator">⭣</span>';
      }
      if (ability && ability.produce) {
        abilityHtml += `
        <div class="essence"><span class="essence__type"><span class="heart">${this._getIcon(
          ability.produce.type
        )}</span></span> <span class="essence__value--produce">${
          ability.produce.value
        }</span></div>
        `;
      }

      abilityHtml += '</div>';
    }

    return `
      <div class="card character" data-characterId="${character.id}" onclick="characterClick(${character.id})">
        ${abilityHtml}
      </div>
    `;
  }

  _getIcon(abilityType) {
    switch (abilityType) {
      case ESSENCE_TYPE.LIFE:
        return '❤';
      case ESSENCE_TYPE.DEATH:
        return '💀';
      case ESSENCE_TYPE.SOUL:
        return '👻';
    }
  }
}
