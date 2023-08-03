/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';


let timerInterval;
let startTime;
let stopTime;
let startHour;
let stopHour;
let totalTime = 0;
let tempoSomado = 0;
let isPaused = true;
let textoFinal;
let pausas = [];
let retomadas = [];

const timerElement = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");
const totalTimeLabel = document.getElementById("totalTime");
const form = document.getElementById("formulario");
const copyButton = document.getElementById("copyButton");
const copyContainer = document.getElementById("copy-container");
const dadosPreenchidos = document.getElementById("dados-preenchidos");
const concluirButton = document.getElementById("concluir");

function render(){
  timerElement.style.display = "block";
  totalTimeLabel.style.display = "none";
  form.style.display = "none";
  copyContainer.style.display = "none";
  copyButton.style.background = "#007bff";
}

render();

function updateTimer() {
  if (!isPaused) {
    const currentTime = Date.now();
    totalTime += currentTime - startTime;
    startTime = currentTime;

    const totalSeconds = Math.floor(totalTime / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    const formattedTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    timerElement.textContent = formattedTime;
  }
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

startButton.addEventListener("click", () => {

  render();

  if (!timerInterval) {
    isPaused = false;
    startTime = Date.now();
    const startDateTime = new Date(startTime);
    startHour = startDateTime.toLocaleTimeString();
    timerInterval = setInterval(updateTimer, 1000);
  }
});

pauseButton.addEventListener("click", () => {
  isPaused = !isPaused;
  if (!isPaused) {
    pauseButton.textContent = "Pausar";
    addRetomada();
    startTime = Date.now();
  } else {
    pauseButton.textContent = "Continuar";
    addPause();
  }
});

stopButton.addEventListener("click", () => {
  if (!isPaused) {
    stopTime = Date.now();
    const stopDateTime = new Date(stopTime);
    stopHour = stopDateTime.toLocaleTimeString();
    totalTime += stopTime - startTime;
  }

  clearInterval(timerInterval);
  timerInterval = null;
  isPaused = true;

  const totalSeconds = Math.floor(totalTime / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  const formattedTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
  totalTimeLabel.textContent = `Total somado: ${formattedTime}`;
  tempoSomado = formattedTime;

  totalTime = 0;
  timerElement.textContent = "00:00:00";
  timerElement.style.display = "none";
  copyContainer.style.display = "none";
  totalTimeLabel.style.display = "block";
  form.style.display = "block";
});

concluirButton.addEventListener("click", () => {
  copyContainer.style.display = "block";
  textoFinal = `
  Hora de Início: ${startHour}
  Hora de Fim: ${stopHour}
  Assunto: ${dadosPreenchidos.value}
  Tempo Total: ${tempoSomado}
  `;
  for (let i = 0; i < Math.min(pausas.length, retomadas.length); i++) {
    const pauseTime = new Date(pausas[i]);
    const retomadaTime = new Date(retomadas[i]);
    textoFinal += `\nPausa: ${pauseTime.toLocaleTimeString()} - Retomada: ${retomadaTime.toLocaleTimeString()}`;
  }
  form.style.display = "none";
  dadosPreenchidos.value = "";
  copyToClipboard();
})

function copyToClipboard() {
  const copyText = document.getElementById("copyText");
  const textArea = document.createElement("textarea");
  copyText.textContent = textoFinal; 
  textArea.value = copyText.textContent;
  
  copyButton.addEventListener("click", () => {
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    copyButton.style.background = "grey";
  })
}

function addPause() {
  pausas.push(Date.now());
}

function addRetomada() {
  retomadas.push(Date.now());
}

