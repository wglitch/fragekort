let cards = [];
let lastIndex = -1;
let showingBack = false;

const card = document.querySelector("#card");
const textA = document.querySelector("#textA");
const textB = document.querySelector("#textB");

async function init() {
  try {
    const response = await fetch("kort.txt", { cache: "no-store" });
    const raw = await response.text();
    cards = parseCards(raw);

    if (!cards.length) {
      cards = ["Kortleken är tom.\n\nLägg texter i kort.txt."];
    }

    showRandomCard(textA);
  } catch (error) {
    cards = ["Kunde inte läsa kort.txt.\n\nKör appen via en enkel lokal server, eller lägg den på GitHub Pages."];
    showRandomCard(textA);
  }
}

function parseCards(raw) {
  return raw
    .split(/\n---+\n/g)
    .map(card => card.trim())
    .filter(Boolean);
}

function randomIndex() {
  if (cards.length < 2) return 0;

  let index = lastIndex;
  while (index === lastIndex) {
    index = Math.floor(Math.random() * cards.length);
  }
  return index;
}

function showRandomCard(target) {
  const index = randomIndex();
  lastIndex = index;
  renderCard(cards[index], target);
}

function renderCard(raw, target) {
  const lines = raw.split(/\n/);
  const title = lines.shift()?.trim() || "";
  const body = lines.join("\n").trim();

  target.innerHTML = "";

  if (title) {
    const h1 = document.createElement("h1");
    h1.textContent = title;
    target.appendChild(h1);
  }

  if (body) {
    const p = document.createElement("p");
    p.textContent = body;
    target.appendChild(p);
  }
}

function draw() {
  const target = showingBack ? textA : textB;
  showRandomCard(target);

  showingBack = !showingBack;
  card.classList.toggle("flipped", showingBack);
}

card.addEventListener("click", draw);

document.addEventListener("keydown", event => {
  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    draw();
  }
});

init();
