import { forOwn, mapKeys, mapValues } from "lodash";

export default class ClientState {
    constructor(clientGraphics) {
        this.clientGraphics = clientGraphics;
        this.meshes = {};
    }

    updatePlayers(positions) {
        let oldPosition = null;
        forOwn(positions, (newPosition, playerId) => {
            if (playerId in this.meshes) {
                oldPosition = this.meshes[playerId].position;
                oldPosition.x = newPosition.x;
                oldPosition.y = newPosition.y;
            }
            else {
                this.createPlayer(playerId, newPosition.x, newPosition.y);
            }
        });
        let playersToClean = [];
        
        mapKeys(this.meshes, (playerId) => {
            if (!(playerId in positions))
                playersToClean.push(playerId);
        });
        playersToClean.forEach((playerId) => {
            this.clientGraphics.removeBall(this.meshes[playerId]);
            delete this.meshes[playerId];
        });
    }

    createPlayer(playerId, x, y) {
        let mesh = this.clientGraphics.createBall();
        mesh.position.x = x;
        mesh.position.y = y;
        this.meshes[playerId] = mesh;
    }

    spinPlayers() {
        mapValues(this.meshes, (mesh) => {
            mesh.rotation.x += 0.05;
            mesh.rotation.y += 0.05;
        });
    }
}