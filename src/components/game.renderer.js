var htmlSegmentsEls = [];

class GameRenderer {
  renderTimer(timer) {
    htmlSegmentsEls = [];
    const html = document.createElement('div');
    for (let i = 0; i < timer.segments.count - 1; i++) {
      const node = document.createElement('div');
      node.classList.add('timer__segment');
      htmlSegmentsEls.push(node);
      html.appendChild(node);
    }
    timerEl.appendChild(html);
  }

  updateTimer(timer) {
    htmlSegmentsEls.forEach((segment, index) => {
      segment.classList.toggle(
        'timer__segment--hidden',
        index < timer.segments.count - 1
      );
    });
  }

  updateStateLifeEssence(value) {
    stateLifeEssenceEl.dataset.value = value;
  }

  updateClipboardLifeEssence(value) {
    clipboardLifeEssenceEl.dataset.value = value;
    if (value > 0) {
      clipboardEl.classList.add('clipboard--visible');
    } else {
      clipboardEl.classList.remove('clipboard--visible');
    }
  }

  updateInventory(state) {
    stateDeathEssenceEl.innerText = state.death;
    stateSoulEssenceEl.innerText = state.soul;
  }
}
