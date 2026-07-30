import * as THREE from "three";

export class World extends THREE.Group {
    /**
     *
     * @type {{
     *     id : number,
     *     instanceId : number,
     * }} size
     */
    data = [];

    constructor(size = { width: 64, height: 32 }) {
        super();
        this.size = size;
        this.geometry = new THREE.BoxGeometry();
        this.material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    }

    genarate() {
        this.generate();
    }

    generate() {
        this.genarateTerrain();
        this.generateMeshes();
    }

    genarateTerrain() {
        this.data = []; // Clear previous data
        for (let x = 0; x < this.size.width; x++) {
            // Loop through width
            const slice = []; // Placeholder for a slice of the world
            for (let y = 0; y < this.size.height; y++) {
                // Loop through height
                const row = []; // Placeholder for a row of blocks
                for (let z = 0; z < this.size.width; z++) {
                    // Loop through depth
                    row.push({
                        // Placeholder for block data
                        id: 1,
                        instanceId: 0,
                    });
                }
                slice.push(row);
            }
            this.data.push(slice);
        }
    }

    generateMeshes() {
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
                    const blockId = this.getBlock(x, y, z).id;
                    const instanceId = mesh.count; // Get the current instance ID before incrementing

                    if (blockId !== 0) {
                        matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
                        mesh.setMatrixAt(instanceId, matrix);
                        this.setBlockInstanceId(x, y, z, instanceId);
                        mesh.count++; // Increment the count only when a block is added
                    }

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

    // genarateWorld() {
    //     this.generate();
    // }

    inBounds(x, y, z) {
        if (
            x >= 0 &&
            x < this.size.width &&
            y >= 0 &&
            y < this.size.height &&
            z >= 0 &&
            z < this.size.width
        ) {
            return true;
        } else {
            return false;
        }
        // return (
        //     x >= 0 && x < this.size.width &&
        //     y >= 0 && y < this.size.height &&
        //     z >= 0 && z < this.size.width
        // );
    }

    /**
     * gets the block at the given coordinates.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {{id: number, instanceId: number}|null}
     */
    getBlock(x, y, z) {
        if (this.inBounds(x, y, z)) {
            return this.data[x][y][z];
        } else {
            return null;
        }
    }

    /**
     * sets the block at the given coordinates.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} id
     */

    setBlockId(x, y, z, id) {
        if (this.inBounds(x, y, z)) {
            this.data[x][y][z].id = id;
        }
    }

    /**
     * sets the block instance ID at the given coordinates.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} instanceId
     */
    setBlockInstanceId(x, y, z, instanceId) {
        if (this.inBounds(x, y, z)) {
            this.data[x][y][z].instanceId = instanceId;
        }
    }
}
