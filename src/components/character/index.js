const ESSENCE_TYPE = {
  LIFE: 'life',
  DEATH: 'death',
  SOUL: 'soul'
};

class Character {
  constructor(id, onDeathCallback) {
    this.id = id;

    this.abilities = [
      {
        consume: {
          type: ESSENCE_TYPE.LIFE,
          value: 0,
          rate: 1
        },
        produce: {
          type: ESSENCE_TYPE.DEATH,
          value: 0,
          rate: 1
        }
      }
    ];

    this.isDead = false;
    this.onDeathCallback = onDeathCallback;
  }

  addLifeEssence(value) {
    if (this.abilities[0].consume) {
      this.abilities[0].consume.value += value;
      if (this.isDead) {
        this.isDead = false;
      }
    }
  }

  tick() {
    const consumer = this.abilities[0].consume;
    if (!this.isDead && consumer.type === ESSENCE_TYPE.LIFE) {
      consumer.value -= consumer.rate;
      consumer.value = Math.max(0, consumer.value);

      if (consumer.value <= 0) {
        this.isDead = true;
        this.onDeathCallback(this);
      }
    }
  }
}

class VoidGenerator extends Character {
  constructor(id, onDeathCallback) {
    super(id, onDeathCallback);

    this.abilities[0].consume.value = 1;
  }

  tick() {
    if (this.abilities[0].consume.value - this.abilities[0].consume.rate >= 0) {
      this.abilities[0].produce.value++;
    }

    super.tick();
  }
}

class LifeOnDeathGenerator extends Character {
  constructor(id, onDeathCallback) {
    super(id, onDeathCallback);
    delete this.abilities[0].produce;

    this.abilities[2] = {
      produce: {
        type: ESSENCE_TYPE.DEATH,
        value: 0,
        rate: 1
      }
    };
  }

  tick() {
    if (!this.isDead && this.abilities[0].consume.value === 1) {
      this.abilities[0]['produce'] = {
        type: ESSENCE_TYPE.LIFE,
        value: 0,
        rate: 1
      };

      this.abilities[0].produce.value = this.abilities[2].produce.value;
      this.abilities[2].produce.value = 0;
    }

    if (this.isDead) {
      this.abilities[2].produce.value++;
    }

    super.tick();
  }
}

class SoulGenerator extends Character {
  constructor(id, onDeathCallback) {
    super(id, onDeathCallback);

    this.abilities[0].produce.type = ESSENCE_TYPE.SOUL;
    this.abilities[0].consume.rate = 5;
  }

  tick() {
    if (this.abilities[0].consume.value - this.abilities[0].consume.rate >= 0) {
      this.abilities[0].produce.value++;
    }

    super.tick();
  }
}
