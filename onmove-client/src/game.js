import {
    Scene, PerspectiveCamera, WebGLRenderer,
    IcosahedronGeometry,
    Mesh, MeshBasicMaterial,
    Vector3
} from "three";

const KeyCode = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
};
Object.freeze(KeyCode);

const KeyEventType = {
    UP: 1,
    DOWN: 2,
};
Object.freeze(KeyEventType);

const CommandType = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
};
Object.freeze(CommandType);

const handleKeyUpdates = (keySet, clientState, dt) => {
    if (keySet.size == 0) {
        return;
    }
    let speed = 4;
    let ds = new Vector3(0, 0, 0);
    if (keySet.has(CommandType.UP)) { ds.setY(ds.y + speed); }
    if (keySet.has(CommandType.DOWN)) { ds.setY(ds.y - speed); }
    if (keySet.has(CommandType.LEFT)) { ds.setX(ds.x - speed); }
    if (keySet.has(CommandType.RIGHT)) { ds.setX(ds.x + speed); }
    ds.normalize().multiplyScalar(speed).multiplyScalar(dt);
    clientState.updatePosition(ds.x, ds.y);
};

const setupKeyListeners = (keySet, document) => {
    const updateKeySet = (commandType, eventType) => {
        if (eventType == KeyEventType.UP) { keySet.delete(commandType); }
        else if (eventType == KeyEventType.DOWN) { keySet.add(commandType); }
    };
    const handleEvent = (code, eventType) => {
        if ([KeyCode.UP, KeyCode.W].includes(code)) { updateKeySet(CommandType.UP, eventType); }
        else if ([KeyCode.DOWN, KeyCode.S].includes(code)) { updateKeySet(CommandType.DOWN, eventType); }
        else if ([KeyCode.LEFT, KeyCode.A].includes(code)) { updateKeySet(CommandType.LEFT, eventType); }
        else if ([KeyCode.RIGHT, KeyCode.D].includes(code)) { updateKeySet(CommandType.RIGHT, eventType); }
    };
    const onKeyDown = (event) => { handleEvent(event.which, KeyEventType.DOWN); };
    const onKeyUp = (event) => { handleEvent(event.which, KeyEventType.UP); };
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);
};

class ClientState {
    constructor(scene, socket) {
        this.scene = scene;
        this.socket = socket;
        this.meshes = {};
        this.startServerListener();
    }

    startServerListener() {
        this.socket.on("positions", positions => {
            this.updatePlayers(positions);
        });
    }

    updatePlayers(positions) {
        let oldPosition = null;
        for (let [playerId, newPosition] of Object.entries(positions)) {
            if (playerId in this.meshes) {
                oldPosition = this.meshes[playerId].position;
                oldPosition.x = newPosition.x;
                oldPosition.y = newPosition.y;
            }
            else {
                this.createPlayer(playerId, newPosition.x, newPosition.y);
            }
        }
        // Clean up old players
        let playersToClean = [];
        for (let [playerId, mesh] of Object.entries(this.meshes)) {
            if (!(playerId in positions)) {
                playersToClean.push(playerId);
            }
        }
        playersToClean.forEach((playerId) => {
            this.scene.remove(this.meshes[playerId]);
            delete this.meshes[playerId];
        });
    }

    createPlayer(playerId, x, y) {
        let geometry = new IcosahedronGeometry(0.4, 1);
        let material = new MeshBasicMaterial({
            color: 0xe05f50,
            wireframe: true
        });
        let mesh = new Mesh(geometry, material);
        mesh.position.x = x;
        mesh.position.y = y;
        this.scene.add(mesh);
        this.meshes[playerId] = mesh;
    }

    spinPlayers() {
        for (let [playerId, mesh] of Object.entries(this.meshes)) {
            mesh.rotation.x += 0.05;
            mesh.rotation.y += 0.05;
        }
    }

    updatePosition(dx, dy) {
        this.socket.emit("move", {
            x: dx,
            y: dy,
        });
    }
}

const GAME_LOOP_FPS = 65;
const GAME_LOOP_SPF = 1.0 / GAME_LOOP_FPS;

const updateGraphics = (renderer, scene, camera) => {
    renderer.render(scene, camera);
};

const updateState = (dt, keySet, clientState) => {
    handleKeyUpdates(keySet, clientState, dt);
    clientState.spinPlayers();
};

const startGame = (document, window, requestAnimationFrame, container, socket) => {
    // Scene, camera, and renderer
    let scene = new Scene();
    
    let camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    let renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    

    // Game updating
    let clientState = new ClientState(scene, socket);

    let keySet = new Set();
    setupKeyListeners(keySet, document);

    let dt = 0;
    let previousTime;
    let update = (currentTime) => {
        if (previousTime != undefined) {
            dt += (currentTime - previousTime) / 1000;
            if (dt >= GAME_LOOP_SPF) {
                updateGraphics(renderer, scene, camera);
                updateState(dt, keySet, clientState);
                dt = 0;
            }
        }
        previousTime = currentTime;
        requestAnimationFrame(update);
    };
    requestAnimationFrame(update);

    container.appendChild(renderer.domElement);
};

export { startGame };
