import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/Addons.js";

export class Player {
    maxSpeed = 10;
    input = new THREE.Vector3();
    velocity = new THREE.Vector3();

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerHeight / window.innerHeight,
        0.1,
        200
    );
    controls = new PointerLockControls(this.camera, document.body);
    cameraHelper = new THREE.CameraHelper(this.camera);

    /**
     * @param {THREE.scene} scene
     */

    constructor(scene) {
        this.camera.position.set(32, 16, 32);
        scene.add(this.camera);
        scene.add(this.cameraHelper);
        document.addEventListener("keydown", this.onkeydown.bind(this));
        document.addEventListener("keyup", this.onKeyUP.bind(this));
    }

    applyInputs(dt) {
        if (!this.controls.isLocked) return;

        this.velocity.copy(this.input);

        if (this.velocity.lengthSq() > 0) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed);
        }

        this.controls.moveRight(this.velocity.x * dt);
        this.controls.moveForward(this.velocity.z * dt);

        document.getElementById("player-porition").innerHTML = this.toString();
    }

    /**
     * @type {THREE.Vector3}
     */

    get position() {
        return this.camera.position;
    }

    /**
     * @param {KeyboardEvent} event
     */

    onkeydown(event) {
        if (!this.controls.isLocked) {
            this.controls.lock();
            return;
        }

        switch (event.code) {
            case "KeyW":
                this.input.z = this.maxSpeed;
                break;

            case "KeyS":
                this.input.z = -this.maxSpeed;
                break;

            case "KeyA":
                this.input.x = -this.maxSpeed;
                break;

            case "KeyD":
                this.input.x = this.maxSpeed;
                break;

            case "KeyR":
                this.position.set(32, 16, 32);
                this.velocity.set(0, 0, 0);
                break;
        }
    }

    onKeyUP(event) {
        switch (event.code) {
            case "KeyW":
            case "KeyS":
                this.input.z = 0;
                break;

            case "KeyA":
            case "KeyD":
                this.input.x = 0;
                break;
        }
    }

    /**
     * @return {string}
     */

    toString() {
        let str = "";
        str += `x: ${this.position.x.toFixed(3)}`;
        str += `y: ${this.position.z.toFixed(3)}`;
        str += `z: ${this.position.x.toFixed(3)}`;
        return str;
    }
}
