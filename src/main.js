import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { World } from "./engine/world/world";
import createUI from "./ui/ui";

const stats = new Stats();
document.body.appendChild(stats.dom);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x88a0e0);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.set(10, 10, 10);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Scene
const scene = new THREE.Scene();
const world = new World();
world.generate();
scene.add(world);

camera.position.set(
    world.size.width * 0.75,
    world.size.height * 1.25,
    world.size.width * 0.75
);
controls.target.set(
    world.size.width / 2,
    world.size.height / 2,
    world.size.width / 2
);
controls.update();

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

function setupLight() {
    const sun = new THREE.DirectionalLight(0xffffff, 1);

    sun.position.set(50, 50, 50);
    sun.castShadow = true;

    // Shadow map quality
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;

    // Shadow camera box
    sun.shadow.camera.left = -50;
    sun.shadow.camera.right = 50;
    sun.shadow.camera.top = 50;
    sun.shadow.camera.bottom = -50;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 150;
    sun.shadow.bias = -0.0005

    sun.shadow.mapSize = new THREE.Vector2(512, 512)

    scene.add(sun);

    // Visualize the shadow camera
    const shadowHelper = new THREE.CameraHelper(sun.shadow.camera);
    scene.add(shadowHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
}

// function setupWorld(size) {

// }

// Rendering loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Required for damping or auto-rotation
    renderer.render(scene, camera);
    stats.update();
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

setupLight();
// setupWorld(8); // Reduced size so cubes fit nicely in view
createUI(world);
animate();
