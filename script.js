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
