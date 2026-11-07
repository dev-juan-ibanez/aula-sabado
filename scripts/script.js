const state = {
  name: 'Aster Valen',
  className: 'Arcanista',
  color: 'amber',
  traits: ['Curioso', 'Leal'],
  stats: { Força: 4, Agilidade: 6, Intelecto: 8, Presença: 5 }
};

const classData = {
  Arcanista: { ability: 'Visão do Véu', text: 'Enxerga a verdade por trás das ilusões.', quote: '“A curiosidade é só a coragem usando uma máscara mais elegante.”' },
  Guardião: { ability: 'Muralha Viva', text: 'Transforma sua determinação em proteção para o grupo.', quote: '“Ninguém atravessa enquanto eu ainda estiver de pé.”' },
  Batedor: { ability: 'Passo Fantasma', text: 'Chega antes do perigo e parte antes do alarme.', quote: '“O melhor caminho é aquele que ninguém percebeu.”' },
  Oráculo: { ability: 'Presságio', text: 'Escuta ecos do futuro nas pequenas coisas.', quote: '“Toda escolha deixa uma sombra antes de acontecer.”' }
};
const colorData = { amber: '#e5a84c', coral: '#e87862', mint: '#66c9ac', blue: '#72a6e8', violet: '#a88ce0' };
const spriteData = { Arcanista: 'sprite-arcanista', Guardião: 'sprite-guardiao', Batedor: 'sprite-batedor', Oráculo: 'sprite-oraculo' };
const maxPoints = 35;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function render() {
  const name = state.name.trim() || 'Personagem sem nome';
  const classInfo = classData[state.className];
  $('#sheetName').textContent = name;
  $('#portraitName').textContent = name.toUpperCase();
  $('#portraitClass').textContent = state.className.toUpperCase();
  $('#abilityName').textContent = classInfo.ability;
  $('#abilityText').textContent = classInfo.text;
  $('#quoteText').textContent = classInfo.quote;
  $('#pointsLeft').textContent = maxPoints - Object.values(state.stats).reduce((sum, value) => sum + value, 0);
  $('#characterArt').style.setProperty('--hero', colorData[state.color]);
  $('#portraitStage').style.setProperty('--accent', colorData[state.color]);
  $('#characterArt').className = 'character-art';
  $('#characterArt .portrait-sprite').className = `portrait-sprite sprite sprite-player ${spriteData[state.className]}`;
  if (typeof game !== 'undefined') renderGame();

  $$('.stat-row').forEach((row) => {
    const stat = row.dataset.stat;
    const value = state.stats[stat];
    row.querySelector('.stat-number').textContent = value;
    row.querySelector('.stat-meter span').style.width = `${value * 10}%`;
  });

  $('#selectedTraits').innerHTML = state.traits.length
    ? state.traits.map((trait) => `<span>${trait}</span>`).join('')
    : '<span>Nenhum definido</span>';
  localStorage.setItem('forja-character', JSON.stringify(state));
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

function setSelected(selector, attribute, value) {
  $$(selector).forEach((item) => item.classList.toggle('selected', item.dataset[attribute] === value));
}

$('#characterName').addEventListener('input', (event) => { state.name = event.target.value; render(); });

$$('#classChoices .choice-card').forEach((button) => button.addEventListener('click', () => {
  state.className = button.dataset.class;
  setSelected('#classChoices .choice-card', 'class', state.className);
  render();
}));

const game = {
    width: 24, height: 10, player: { x: 3, y: 7 }, enemy: { x: 18, y: 7, alive: true },
    health: 100, ore: 0, xp: 0, level: 1, blocks: []
  };
  const gameKey = 'forja-adventure';
  const savedGame = localStorage.getItem(gameKey);
  if (savedGame) {
    try { Object.assign(game, JSON.parse(savedGame)); } catch { localStorage.removeItem(gameKey); }
  }

  function createWorld() {
    game.blocks = [];
    for (let y = 0; y < game.height; y += 1) {
      for (let x = 0; x < game.width; x += 1) {
        if (y >= 8 || (y === 7 && (x < 2 || x > 20)) || (y === 6 && [6, 7, 13, 14].includes(x))) {
          game.blocks.push({ x, y, type: y === 8 ? 'dirt' : (Math.random() > .65 ? 'ore' : 'stone') });
        }
      }
    }
  }

  function gameMessage(message) { $('#gameLog').textContent = message; }
  function gamePosition(entity) { return { left: `${entity.x * (100 / game.width)}%`, top: `${entity.y * (100 / game.height)}%` }; }
  function saveGame() { localStorage.setItem(gameKey, JSON.stringify(game)); }

  function renderGame() {
    const grid = $('#worldGrid');
    grid.innerHTML = game.blocks.map((block) => `<span class="world-tile ${block.type}" style="grid-column:${block.x + 1};grid-row:${block.y + 1}"></span>`).join('');
    const player = document.createElement('span');
    player.className = `game-entity game-player sprite sprite-player ${spriteData[state.className]}`; Object.assign(player.style, gamePosition(game.player)); grid.append(player);
    if (game.enemy.alive) {
      const enemy = document.createElement('span');
      enemy.className = 'game-entity game-enemy sprite sprite-enemy'; Object.assign(enemy.style, gamePosition(game.enemy)); grid.append(enemy);
    }
    const levelXp = (game.level - 1) * 50;
    const progress = Math.min(100, ((game.xp - levelXp) / 50) * 100);
    $('#gameName').textContent = (state.name || 'Aventureiro').toUpperCase();
    $('#gameHealth').textContent = `${game.health} / 100`;
    $('#gameLevel').textContent = String(game.level).padStart(2, '0');
    $('#gameOre').textContent = game.ore;
    $('#inventoryOre').textContent = game.ore;
    $('#inventoryXp').textContent = game.xp;
    $('#questProgress').style.width = `${Math.min(100, game.ore * 20)}%`;
    $('#questTitle').textContent = game.enemy.alive ? (game.ore >= 5 ? 'O guardião desperta' : 'A primeira escavação') : 'Caverna conquistada';
    $('#questText').textContent = game.enemy.alive ? (game.ore >= 5 ? 'Derrote o guardião para concluir a expedição.' : 'Encontre 5 minérios para abrir o caminho até a caverna.') : 'Você venceu! Continue explorando para encontrar novos tesouros.';
    $('#gameWorld').style.setProperty('--game-progress', `${progress}%`);
    saveGame();
  }

  function movePlayer(dx, dy = 0) {
    const next = { x: Math.max(0, Math.min(game.width - 1, game.player.x + dx)), y: Math.max(0, Math.min(game.height - 1, game.player.y + dy)) };
    if (game.blocks.some((block) => block.x === next.x && block.y === next.y)) return gameMessage('Um bloco bloqueia o caminho. Tente minerar.');
    game.player = next;
    if (game.enemy.alive && Math.abs(game.player.x - game.enemy.x) + Math.abs(game.player.y - game.enemy.y) < 2) gameMessage('O guardião está perto! Ataque com espaço.');
    renderGame();
  }

  function mine() {
    const target = game.blocks.findIndex((block) => Math.abs(block.x - game.player.x) <= 1 && Math.abs(block.y - game.player.y) <= 1 && block.type !== 'dirt');
    if (target < 0) return gameMessage('Não há minério ao seu alcance.');
    const block = game.blocks.splice(target, 1)[0];
    if (block.type === 'ore') { game.ore += 1; game.xp += 10; gameMessage('Minério de Umbra coletado!'); }
    else gameMessage('Você abriu um caminho pela pedra.');
    if (game.xp >= game.level * 50) { game.level += 1; gameMessage(`Nível ${game.level}! Sua aventura ficou mais perigosa.`); }
    renderGame();
  }

  function attack() {
    if (!game.enemy.alive) return gameMessage('A caverna está segura por enquanto.');
    const distance = Math.abs(game.player.x - game.enemy.x) + Math.abs(game.player.y - game.enemy.y);
    if (distance > 2) return gameMessage('Chegue mais perto do guardião para atacar.');
    game.enemy.alive = false; game.xp += 50; gameMessage('Guardião derrotado! A caverna é sua.');
    renderGame();
  }

  $$('[data-action]').forEach((button) => button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'left') movePlayer(-1);
    if (action === 'right') movePlayer(1);
    if (action === 'mine') mine();
    if (action === 'attack') attack();
  }));
  $('#gameWorld').addEventListener('keydown', (event) => {
    const actions = { ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0], ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1] };
    if (actions[event.key]) { event.preventDefault(); movePlayer(...actions[event.key]); }
    if (event.code === 'Space') { event.preventDefault(); attack(); }
  });
  $('#gameWorld').addEventListener('click', () => $('#gameWorld').focus());
  $('#resetGameButton').addEventListener('click', () => { Object.assign(game, { player: { x: 3, y: 7 }, enemy: { x: 18, y: 7, alive: true }, health: 100, ore: 0, xp: 0, level: 1 }); createWorld(); renderGame(); gameMessage('Um novo mundo foi criado. Boa sorte, aventureiro!'); });
  createWorld();
  renderGame();
$$('#colorChoices .swatch').forEach((button) => button.addEventListener('click', () => {
  state.color = button.dataset.color;
  setSelected('#colorChoices .swatch', 'color', state.color);
  render();
}));

$$('#traitChoices .trait').forEach((button) => button.addEventListener('click', () => {
  const trait = button.dataset.trait;
  if (state.traits.includes(trait)) state.traits = state.traits.filter((item) => item !== trait);
  else if (state.traits.length < 3) state.traits.push(trait);
  $$('#traitChoices .trait').forEach((item) => item.classList.toggle('selected', state.traits.includes(item.dataset.trait)));
  render();
}));

$$('.stat-row').forEach((row) => row.addEventListener('click', (event) => {
  const stat = row.dataset.stat;
  const change = event.target.classList.contains('plus') ? 1 : event.target.classList.contains('minus') ? -1 : 0;
  const total = Object.values(state.stats).reduce((sum, value) => sum + value, 0);
  if (!change || state.stats[stat] + change < 1 || state.stats[stat] + change > 10 || (change > 0 && total >= maxPoints)) return;
  state.stats[stat] += change;
  render();
}));

$('#saveButton').addEventListener('click', () => showToast('Ficha salva no seu navegador.'));
$('#shareButton').addEventListener('click', async () => {
  const summary = `${state.name || 'Personagem sem nome'} · ${state.className} · ${state.traits.join(', ')}`;
  try { await navigator.clipboard.writeText(summary); showToast('Resumo copiado para a área de transferência.'); }
  catch { showToast(summary); }
});
$('#clearButton').addEventListener('click', () => {
  state.name = ''; state.className = 'Arcanista'; state.color = 'amber'; state.traits = []; state.stats = { Força: 4, Agilidade: 6, Intelecto: 8, Presença: 5 };
  $('#characterName').value = '';
  setSelected('#classChoices .choice-card', 'class', state.className);
  setSelected('#colorChoices .swatch', 'color', state.color);
  $$('#traitChoices .trait').forEach((item) => item.classList.remove('selected'));
  render(); showToast('Ficha limpa.');
});
$('#randomizeButton').addEventListener('click', () => {
  const names = ['Nira Sol', 'Cael Moura', 'Iris Venn', 'Téo Ardent'];
  const classes = Object.keys(classData);
  state.name = names[Math.floor(Math.random() * names.length)];
  state.className = classes[Math.floor(Math.random() * classes.length)];
  state.color = Object.keys(colorData)[Math.floor(Math.random() * Object.keys(colorData).length)];
  state.traits = ['Curioso', 'Leal', 'Inquieto', 'Sarcástico', 'Resiliente', 'Intuitivo'].sort(() => Math.random() - .5).slice(0, 2);
  $('#characterName').value = state.name;
  setSelected('#classChoices .choice-card', 'class', state.className);
  setSelected('#colorChoices .swatch', 'color', state.color);
  $$('#traitChoices .trait').forEach((item) => item.classList.toggle('selected', state.traits.includes(item.dataset.trait)));
  render(); showToast('Uma nova ficha foi forjada.');
});

const saved = localStorage.getItem('forja-character');
if (saved) {
  try {
    Object.assign(state, JSON.parse(saved));
    $('#characterName').value = state.name;
    setSelected('#classChoices .choice-card', 'class', state.className);
    setSelected('#colorChoices .swatch', 'color', state.color);
    $$('#traitChoices .trait').forEach((item) => item.classList.toggle('selected', state.traits.includes(item.dataset.trait)));
  } catch { localStorage.removeItem('forja-character'); }
}
render();
