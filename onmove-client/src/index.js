require("./style.css");
require("./favicon.ico");

import { startGame } from "./game.js";

const io = require("socket.io-client");
let socket = io("http://localhost:3000");

let container = document.createElement("div");
document.body.appendChild(container);

startGame(document, window, requestAnimationFrame, container, socket);
