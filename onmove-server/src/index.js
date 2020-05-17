const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class ServerState {
    constructor() {
        this.positions = {};
    }

    addPlayer(playerId) {
        let position = new Position(0, 0);
        this.positions[playerId] = position;
    }

    updatePlayer(playerId, data) {
        let [dx, dy] = [data.x, data.y];
        let position = this.positions[playerId];
        position.x += dx;
        position.y += dy;
    }
}

let serverState = new ServerState();

io.on("connection", (socket) => {
    // console.log("User connected.");
    let socketId = socket.id;
    let clientIp = socket.request.connection.remoteAddress;
    let clientPort = socket.request.connection.remotePort;

    console.log(`New connection ${socketId} from ${clientIp}:${clientPort}`);
    serverState.addPlayer(socketId);

    socket.on("move", data => {
        serverState.updatePlayer(socketId, data);
        io.emit("positions", serverState.positions);
    });
});

http.listen(3000, () => {
    console.log("Listening for connections on *:3000");
});
