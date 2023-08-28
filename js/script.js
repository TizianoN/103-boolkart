// ### ARRAY DI GIOCATORI
const players = [
  {
    name: 'Yellow Truck',
    img: './img/car-1.png',
    position: 15,
  },
  {
    name: 'Ape',
    img: './img/car-2.png',
    position: 15,
  },
  {
    name: 'Family Car',
    img: './img/car-3.png',
    position: 15,
  },
  {
    name: 'Cargo Truck',
    img: './img/car-4.png',
    position: 15,
  },
];

// ### ELEMENTI DI INTERESSE
const sceneElement = document.getElementById('scene');
const resultsElement = document.getElementById('results');
const playButton = document.getElementById('play');
const resetButton = document.getElementById('reset');

// ### VARIABILI GLOBALI
const refreshRate = 100;
let winners = [];
let gameInProgress = false;

// ### IMPOSTO LA SCENA
function setupScene() {
  // * RESETTO L'HTML
  sceneElement.innerHTML = '';
  resultsElement.innerHTML = '';
  playButton.classList.remove('d-none');
  resetButton.classList.add('d-none');

  // * SVUOTO L'ARRAY DEI VINCITORI
  winners = [];

  // * PER OGNI GIOCATORE
  players.forEach((player) => {
    // * IMPOSTO I VALORI DI PARTENZA DEL GIOCATORE
    player.position = 15;
    player.acceleration = rand(60, 120);
    player.time = 0;

    // * GENERO IL TRACCIATO
    const track = document.createElement('div');
    track.classList.add('track');

    // * GENERO LA MACCHININA
    const car = document.createElement('img');
    car.src = player.img;
    car.title = player.name;
    car.classList.add('car');
    car.style.left = player.position + 'px';

    // * AGGIUNGO IL NODO DELLA MACCHININA AL PLAYER
    player.nodeCar = car;

    // * GENERO IL NOME DEL GIOCATORE DA VISUALIZZARE SUL TRACCIATO
    const playerNameEl = document.createElement('span');
    playerNameEl.innerHTML = player.name;

    // * AGGIUNGO AL TRACCIATO MACCHININA E NOME
    track.append(car);
    track.append(playerNameEl);

    // * AGGIUNGO IL TRACCIATO ALLA SCENA
    sceneElement.append(track);
  });
}

// ### GESTISCO LA CORSA
function race() {
  // * PER OGNI GIOCATORE
  players.forEach((player) => {
    // * SETTO UN INTERVALLO (direttamente nell'oggetto player)
    player.interval = setInterval(() => {
      // * OGNI TICK INCREMENTO LA POSIZIONE ED IL TEMPO TRASCORSO
      player.position += player.acceleration;
      player.time += refreshRate;

      // * CONTROLLO SE LA MACCHININA E' ARRIVATA
      if (player.position >= 720) {
        // * SETTO LA POSIZIONE AL PUNTO FINALE
        player.position = 720;
        // * GESTISCO LA FINE DELLA CORSA DEL GIOCATORE
        endRace(player);
      }

      // * ESEGUO IL RENDER NELLA NUOVA POSIZIONE
      player.nodeCar.style.left = player.position + 'px';
    }, refreshRate);
  });
}

// ### GESTISCO LA FINE DELLA CORSA DEL GIOCATORE
function endRace(player) {
  // * CLEARO L'INTERVAL
  clearInterval(player.interval);

  // * AGGIUNGO IL GIOCATORE AI VINCITORI
  winners.push(player);

  // * STAMPO IL BLOCCO DEI RISULTATI
  printResultBlock(player, winners.length);

  // * CONTROLLO SE SONO ARRIVATI TUTTI
  if (winners.length == players.length) {
    // * LA GARA E' FINITA
    gameInProgress = false;

    // * MOSTRO IL PULSANTE RESET
    resetButton.classList.remove('d-none');
  }
}

// ### STAMPO IL RISULTATO DEL GIOCATORE
function printResultBlock(player, placement) {
  // * DETERMINO IL PLACEMENT TEXT CORRETTO
  let placementText = placement + 'th';
  if (placement == 1) placementText = placement + 'st';
  if (placement == 2) placementText = placement + 'nd';
  if (placement == 3) placementText = placement + 'rd';

  // * CREO IL TEMPLATE LITERALS DEL RISULTATO
  const resultBlock = `
  <div class="result-block">
    <h2>${placementText} place</h2>
    ${player.time}ms, ${player.name}
  </div>`;

  // * LO AGGIUNGO ALL'HTML
  resultsElement.innerHTML += resultBlock;
}

// ### PLAY CLICK
playButton.addEventListener('click', function () {
  // * SE NON C'E' GIA' UNA PARTITA IN CORSO
  if (!gameInProgress) {
    // * AGGIORNO LO STATO DELLA PARTITA
    gameInProgress = true;

    // * NASCONDO IL PULSANTE PLAY
    playButton.classList.add('d-none');

    // * INIZIA LA CORSA!
    race();
  }
});

// ### RESET CLICK
resetButton.addEventListener('click', function () {
  // * SETUPPO UNA NUOVA SCENA
  setupScene();
});

// ### NUMERO RANDOMICO
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ### SETUPPO UNA SCENA ON LOAD
setupScene();
