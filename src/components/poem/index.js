class Poem {
  constructor() {}

  getHtml(families) {
    return `
      <div class="card poem__wrapper">
      <div class="poem">
        The ${families[0].name}s were first <br>
        A violent death <br>
        Sanguine tainted <br>
        The ${families[1].name} below <br>
        As the Great ${families[2].name} <br>
        Gazed the dark, below <br>
      </div>
    </div>
    `;
  }
}
