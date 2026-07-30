import * as THREE from "three";

export class World extends THREE.Group {

    
    constructor(size = { width: 64, height: 32 }) {
        super();
        this.size = size;
        this.geometry = new THREE.BoxGeometry();
        this.material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    }

    generate() {
        this.clear(); // Clear previous meshes if any

        const maxCount = this.size.width * this.size.width * this.size.height;
        const mesh = new THREE.InstancedMesh(
            this.geometry,
            this.material,
            maxCount
        );
        mesh.count = 0;

        const matrix = new THREE.Matrix4();
        for (let x = 0; x < this.size.width; x++) {
            for (let y = 0; y < this.size.height; y++) {
                for (let z = 0; z < this.size.width; z++) {
                    matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);

                    mesh.setMatrixAt(mesh.count++, matrix);

                    // const blocks = new THREE.Mesh(this.geometry, this.material);
                    // blocks.position.set(x, y, z);
                    // blocks.position.set(
                    //     x - this.size.width / 2,
                    //     y - this.size.height / 2,
                    //     z - this.size.width / 2
                    // );
                    // this.add(blocks);
                }
            }
        }
        this.add(mesh);
    }

    genarateWorld() {
        this.generate();
    }
}
