require("./style.css");

import Game from "./game.js";

const io = require("socket.io-client");

const urlParams = new URLSearchParams(window.location.search);
const defaultServerAddress = "http://localhost:3000";
const serverAddress = urlParams.get("server") || defaultServerAddress;
let clientSocket = io(serverAddress);

let graphicsElement = document.createElement("div");
document.body.appendChild(graphicsElement);

const game = new Game(window, graphicsElement, clientSocket);
game.start();
