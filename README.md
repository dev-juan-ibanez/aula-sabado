# Forja

Criador de personagens construído somente com HTML, CSS e JavaScript, sem frameworks ou etapa de build. A interface permite montar uma ficha de aventureiro e acompanhar a prévia visual em tempo real.

## Recursos

- Edição do nome do personagem.
- Escolha entre quatro classes: Arcanista, Guardião, Batedor e Oráculo.
- Seleção da paleta do manto.
- Seleção de até três traços marcantes.
- Distribuição de pontos entre Força, Agilidade, Intelecto e Presença.
- Geração aleatória, limpeza e salvamento automático da ficha.
- Persistência dos dados no `localStorage` do navegador.
- Cópia do resumo do personagem para a área de transferência.
- Layout responsivo para desktop, tablet e celular.
- Expansão jogável "As Minas de Umbra", com exploração, mineração, combate e progressão.
- Sprites pixel-art em CSS para as quatro classes jogáveis e o guardião.

## Como executar

Como é um projeto estático, abra o arquivo `index.html` diretamente no navegador. Também é possível servir a pasta com qualquer servidor HTTP local.

Exemplo:

```bash
python3 -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

## Estrutura

```text
.
├── index.html
├── scripts/
│   └── script.js
├── styles/
│   └── styles.css
└── README.md
```

## Expansão jogável

Na seção **As Minas de Umbra**, use as setas ou WASD para explorar o mundo, `Espaço` para atacar e o botão **Minerar** para coletar minério. O progresso da aventura é salvo automaticamente no navegador, junto com a ficha do personagem.

Os sprites são desenhados diretamente em CSS e mudam automaticamente quando a classe da ficha é alterada: Arcanista, Guardião, Batedor e Oráculo têm cores, silhuetas e equipamentos próprios.

## Tecnologias

- HTML5 semântico
- CSS3 com layout responsivo e ilustração criada com CSS
- JavaScript moderno usando APIs do navegador
- Google Fonts: DM Sans e Space Grotesk