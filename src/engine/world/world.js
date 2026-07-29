import * as THREE from "three";

export class World extends THREE.Group {
    constructor(size = { width: 32, height: 16 }) {
        super();
        this.size = size;
        this.geometry = new THREE.BoxGeometry();
        this.material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    }

    genarateWorld() {
        for (let x = 0; x < this.size.width; x++) {
            for (let y = 0; y < this.size.height; y++) {
                for (let z = 0; z < this.size.width; z++) {
                    const blocks = new THREE.Mesh(this.geometry, this.material);
                    blocks.position.set(
                        x - this.size.width / 2,
                        y - this.size.height / 2,
                        z - this.size.width / 2
                    );
                    this.add(blocks);
                }
            }
        }
    }
}

                  