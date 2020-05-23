require("./style.css");

import { startGame } from "./game.js";

const io = require("socket.io-client");

const urlParams = new URLSearchParams(window.location.search);
const defaultServerAddress = "http://localhost:3000";
let serverAddress = urlParams.get("server");
serverAddress = serverAddress || defaultServerAddress;
let socket = io(serverAddress);

let container = document.createElement("div");
document.body.appendChild(container);

startGame(document, window, requestAnimationFrame, container, socket);
