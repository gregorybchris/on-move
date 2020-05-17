require('./style.css');
require('./favicon.ico');

import { getDisplayParts } from './game.js';

let [renderer, animate] = getDisplayParts();
animate();

// let container = document.getElementById('container');
document.body.appendChild(renderer.domElement);
