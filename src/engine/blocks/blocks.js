import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

function loadTexture(path) {
    const texture = textureLoader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
}

const textures = {
    grass: loadTexture("src/assets/textures/blocks/grass/grassBlock_top.png"),
    grassSide: loadTexture(
        "src/assets/textures/blocks/grass/grassBlock_side.png"
    ),
    dirt: loadTexture("src/assets/textures/blocks/dirt/dirt.png"),
    stone: loadTexture("src/assets/textures/blocks/stone/stone.png"),
    coalOre: loadTexture("src/assets/textures/blocks/coal_ore/coalOre.png"),
    ironOre: loadTexture("src/assets/textures/blocks/iron_ore/ironOre.png"),
};

export const blocks = {
    empty: {
        id: 0,
        name: "Empty",
    },
    grass: {
        id: 1,
        name: "Grass",
        color: 0x559020,
        material: [
            new THREE.MeshLambertMaterial({ map: textures.grassSide }),
            new THREE.MeshLambertMaterial({ map: textures.grassSide }),
            new THREE.MeshLambertMaterial({ map: textures.grass }),
            new THREE.MeshLambertMaterial({ map: textures.grass }),
            new THREE.MeshLambertMaterial({ map: textures.grassSide }),
            new THREE.MeshLambertMaterial({ map: textures.grassSide }),
        ],
    },
    dirt: {
        id: 2,
        name: "Dirt",
        color: 0x8b4513,
        material: new THREE.MeshLambertMaterial({
            map: textures.dirt,
        }),
    },

    stone: {
        id: 3,
        name: "Stone",
        color: 0x808080,
        material: new THREE.MeshLambertMaterial({
            map: textures.stone,
        }),
        scale: { x: 30, y: 30, z: 30 },
        scarcity: 0.5,
    },

    coalOre: {
        id: 4,
        name: "Coal Ore",
        color: 0x333333,
        material: new THREE.MeshLambertMaterial({
            map: textures.coalOre,
        }),
        scale: { x: 30, y: 30, z: 30 },
        scarcity: 0.5,
    },

    ironOre: {
        id: 5,
        name: "Iron Ore",
        color: 0x4c302f,
        material: new THREE.MeshLambertMaterial({
            map: textures.ironOre,
        }),
        scale: { x: 30, y: 30, z: 30 },
        scarcity: 0.5,
    },
};

export const resources = [blocks.stone, blocks.coalOre, blocks.ironOre];
