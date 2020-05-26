
import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import { IcosahedronGeometry, Mesh, MeshBasicMaterial } from "three";

export default class ClientGraphics {
    constructor(window) {
        this.window = window;
        this._initGraphics();
        this.setupWindowListener();
    }

    _initGraphics() {
        let [width, height] = [this.window.innerWidth, this.window.innerHeight];

        this.scene = new Scene();

        this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 6;

        this.renderer = new WebGLRenderer();
        this.renderer.setSize(width, height);
    }

    setupWindowListener() {
        const onWindowResize = () => {
            let [width, height] = [this.window.innerWidth, this.window.innerHeight];
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        };
        this.window.addEventListener("resize", onWindowResize, false);
    }

    update() {
        this.renderer.render(this.scene, this.camera);
    }

    createBall() {
        let geometry = new IcosahedronGeometry(0.4, 1);
        let material = new MeshBasicMaterial({
            color: 0xe05f50,
            wireframe: true
        });
        let mesh = new Mesh(geometry, material);
        this.scene.add(mesh);
        return mesh;
    }

    removeBall(mesh) {
        this.scene.remove(mesh);
    }
}
