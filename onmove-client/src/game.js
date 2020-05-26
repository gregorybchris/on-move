import { Vector3 } from "three";

import ClientGraphics from "./client-graphics.js";
import ClientState from "./client-state.js";
import { KeyboardContext, KeyCommand } from "./keyboard-context.js";

const GAME_LOOP_SPF = 1.0 / 65.0;

export default class Game {
    constructor(window, graphicsElement, clientSocket) {
        this.window = window;
        this.graphicsElement = graphicsElement;
        this.clientSocket = clientSocket;
        this.keyboardContext = this.getKeyboardContext();
        this.clientGraphics = new ClientGraphics(window);
        this.clientState = new ClientState(this.clientGraphics);
    }

    start() {
        this.clientSocket.on("positions", positions => {
            this.clientState.updatePositions(positions);
        });

        let dt = 0;
        let previousTime;
        let update = (currentTime) => {
            if (previousTime != undefined) {
                dt += (currentTime - previousTime) / 1000;
                if (dt >= GAME_LOOP_SPF) {
                    this.clientGraphics.update();
                    this.updateState(dt, this.clientState);
                    dt = 0;
                }
            }
            previousTime = currentTime;
            this.window.requestAnimationFrame(update);
        };
        this.window.requestAnimationFrame(update);
        this.graphicsElement.appendChild(this.clientGraphics.renderer.domElement);
    }

    updateState(dt, clientState) {
        this.keyboardContext.update(dt);
        clientState.spinPlayers();
    }

    getKeyboardContext() {
        let keyboardContext = new KeyboardContext(this.window);
        const onKeyboardUpdate = (keySet, dt) => {
            if (keySet.size == 0)
                return;

            let speed = 4;
            let ds = new Vector3(0, 0, 0);
            if (keySet.has(KeyCommand.UP)) ds.setY(ds.y + speed);
            if (keySet.has(KeyCommand.DOWN)) ds.setY(ds.y - speed);
            if (keySet.has(KeyCommand.LEFT)) ds.setX(ds.x - speed);
            if (keySet.has(KeyCommand.RIGHT)) ds.setX(ds.x + speed);

            ds.normalize().multiplyScalar(speed).multiplyScalar(dt);
            let position = { x: ds.x, y: ds.y };
            this.clientSocket.emit("move", position);
        };
        keyboardContext.registerListener(onKeyboardUpdate);
        keyboardContext.listen();
        return keyboardContext;
    }
}
