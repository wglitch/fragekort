let cards = [];
let lastIndex = -1;
let locked = false;

const card = document.querySelector("#card");
const cardText = document.querySelector("#cardText");

async function init() {
  try {
    const response = await fetch("kort.txt", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Kunde inte läsa kort.txt");
    }

    const raw = await response.text();
    cards = parseCards(raw);

    if (!cards.length) {
      cards = ["Kortleken är tom.\n\nLägg texter i kort.txt."];
    }
  } catch (error) {
    cards = ["Kunde inte läsa kort.txt.\n\nLägg filerna på GitHub Pages eller kör via en enkel lokal server."];
  }

  showRandomCard();
}

function parseCards(raw) {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split(/^\s*---+\s*$/gm)
    .map(card => card.trim())
    .filter(Boolean);
}

function getRandomIndex() {
  if (cards.length < 2) return 0;

  let index = lastIndex;
  while (index === lastIndex) {
    index = Math.floor(Math.random() * cards.length);
  }

  return index;
}

function showRandomCard() {
  const index = getRandomIndex();
  lastIndex = index;
  renderCard(cards[index]);
}

function renderCard(raw) {
  const lines = raw.split(/\n/);
  const title = lines.shift()?.trim() || "";
  const body = lines.join("\n").trim();

  cardText.innerHTML = "";

  if (title) {
    const h1 = document.createElement("h1");
    h1.textContent = title;
    cardText.appendChild(h1);
  }

  if (body) {
    const p = document.createElement("p");
    p.textContent = body;
    cardText.appendChild(p);
  }
}

function draw() {
  if (locked) return;
  locked = true;

  card.classList.add("switching");

  window.setTimeout(() => {
    showRandomCard();
  }, 130);

  window.setTimeout(() => {
    card.classList.remove("switching");
    locked = false;
  }, 280);
}

card.addEventListener("click", draw);

document.addEventListener("keydown", event => {
  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    draw();
  }
});

init();
