import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/Addons.js";
import RNG from "./rng";
import { blocks, resources } from "../blocks/blocks.js";

export class World extends THREE.Group {
    /**
     *
     * @type {{
     *     id : number,
     *     instanceId : number,
     * }} size
     */
    data = [];

    // threshold = 0.5; // Threshold for block generation (0..1)

    parameters = {
        seed: 0,
        terrain: {
            enabled: true,
            scale: 30, // Scale of the noise
            magnitude: 0.5, // Magnitude of the noise
            offset: 0.2, // Offset for the noise
        },
    };

    constructor(size = { width: 64, height: 32 }) {
        super();
        this.size = size;
        this.geometry = new THREE.BoxGeometry();
        // this.material = new THREE.MeshLambertMaterial();
    }

    generate() {
        const rng = new RNG(this.parameters.seed);
        this.initializeTerrain();

        // if (this.parameters.terrain.enabled !== false) {
        this.generateTerrain(rng);
        this.generateResources(rng);
        // } else {
        //     this.generateResources(rng);
        // }

        this.generateMeshes();
    }

    /**
     * initialize the terrain data
     * */
    initializeTerrain() {
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
                        id: blocks.empty.id, // Default to empty block
                        instanceId: null,
                    });
                }
                slice.push(row);
            }
            this.data.push(slice);
        }
    }

    generateResources(rng) {
        const simplex = new SimplexNoise();
        const scale = this.parameters.terrain.scale;

        resources.forEach((resource) => {
            for (let x = 0; x < this.size.width; x++) {
                for (let y = 0; y < this.size.height; y++) {
                    for (let z = 0; z < this.size.width; z++) {
                        const currentBlockId =
                            this.getBlock(x, y, z)?.id ?? blocks.empty.id;

                        if (
                            currentBlockId !== blocks.empty.id &&
                            currentBlockId !== blocks.grass.id
                        ) {
                            const value = simplex.noise3d(
                                x / resource.scale.x,
                                y / resource.scale.y,
                                z / resource.scale.z
                            );

                            if (value > resource.scarcity) {
                                this.setBlockId(x, y, z, resource.id);
                            }
                        }
                    }
                }
            }
        });
    }

    generateFlatTerrain() {
        const height = Math.floor(this.size.height * 0.4);

        for (let x = 0; x < this.size.width; x++) {
            for (let z = 0; z < this.size.width; z++) {
                for (let y = 0; y < this.size.height; y++) {
                    if (y < height) {
                        this.setBlockId(x, y, z, blocks.dirt.id);
                    } else if (y === height) {
                        this.setBlockId(x, y, z, blocks.grass.id);
                    } else {
                        this.setBlockId(x, y, z, blocks.empty.id);
                    }
                }
            }
        }
    }

    generateTerrain(rng) {
        // const rng = new RNG(this.seed);
        const simplex = new SimplexNoise();

        for (let x = 0; x < this.size.width; x++) {
            for (let z = 0; z < this.size.width; z++) {
                // Generate a height value using Simplex noise
                const value = simplex.noise(
                    x / this.parameters.terrain.scale,
                    z / this.parameters.terrain.scale
                );

                const scaledNoise =
                    this.parameters.terrain.offset +
                    this.parameters.terrain.magnitude * value;

                let height = Math.floor(this.size.height * scaledNoise);

                height = Math.max(0, Math.min(this.size.height - 1, height)); // Clamp height to valid range

                for (let y = 0; y < this.size.height; y++) {
                    if (
                        y < height &&
                        this.getBlock(x, y, z).id === blocks.empty.id
                    ) {
                        this.setBlockId(x, y, z, blocks.dirt.id);
                    } else if (y === height) {
                        this.setBlockId(x, y, z, blocks.grass.id);
                    } else if (y > height) {
                        this.setBlockId(x, y, z, blocks.empty.id);
                    }
                }
            }
        }
    }

    generateMeshes() {
        this.clear(); // Clear previous meshes if any

        const maxCount = this.size.width * this.size.width * this.size.height;
        // create a lookup table
        const meshes = {};

        Object.values(blocks)
            .filter((blockType) => blockType.id !== blocks.empty.id)
            .forEach((blockType) => {
                const mesh = new THREE.InstancedMesh(
                    this.geometry,
                    blockType.material,
                    maxCount
                );

                mesh.name = blockType.name;
                mesh.count = 0;
                mesh.castShadow = true
                mesh.receiveShadow = true

                meshes[blockType.id] = mesh;
            });
        const matrix = new THREE.Matrix4();
        for (let x = 0; x < this.size.width; x++) {
            for (let y = 0; y < this.size.height; y++) {
                for (let z = 0; z < this.size.width; z++) {
                    const blockId = this.getBlock(x, y, z).id;
                    

                    if (blockId === blocks.empty.id) continue;

                    const mesh = meshes[blockId];
                    const instanceId = mesh.count; // Get the current instance ID before incrementing

                    if (!this.isBlockObscured(x, y, z)) {
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
        this.add(...Object.values(meshes));
    }

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

    isBlockObscured(x, y, z) {
        const up = this.getBlock(x, y + 1, z)?.id ?? blocks.empty.id;
        const down = this.getBlock(x, y - 1, z)?.id ?? blocks.empty.id;
        const left = this.getBlock(x - 1, y, z)?.id ?? blocks.empty.id;
        const right = this.getBlock(x + 1, y, z)?.id ?? blocks.empty.id;
        const front = this.getBlock(x, y, z + 1)?.id ?? blocks.empty.id;
        const back = this.getBlock(x, y, z - 1)?.id ?? blocks.empty.id;

        // if any of the adjacent blocks are not empty, then the block is obscured
        if (
            up === blocks.empty.id ||
            down === blocks.empty.id ||
            left === blocks.empty.id ||
            right === blocks.empty.id ||
            front === blocks.empty.id ||
            back === blocks.empty.id
        ) {
            return false;
        } else {
            return true;
        }

        // const directions = [
        //     [1, 0, 0], // right
        //     [-1, 0, 0], // left
        //     [0, 1, 0], // up
        //     [0, -1, 0], // down
        //     [0, 0, 1], // forward
        //     [0, 0, -1], // backward
        // ];
        // for (const [dx, dy, dz] of directions) {
        //     const nx = x + dx;
        //     const ny = y + dy;
        //     const nz = z + dz;
        //     if (this.inBounds(nx, ny, nz)) {
        //         if (this.getBlock(nx, ny, nz).id !== blocks.empty.id) {
        //             return true;
        //         }
        //     }
        // }
        // return false;
    }
}
