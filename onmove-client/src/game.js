import {
    Scene, PerspectiveCamera, WebGLRenderer,
    IcosahedronGeometry, MeshBasicMaterial, Mesh
} from 'three';


const getDisplayParts = () => {
    let scene = new Scene();
    let camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    let renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    let geometry = new IcosahedronGeometry(undefined, 1);
    // let geometry = new THREE.BoxGeometry();
    let material = new MeshBasicMaterial({ color: 0xe05f50 });
    let cube = new Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = () => {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    }

    return [renderer, animate];
}

export { getDisplayParts };
