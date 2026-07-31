import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { resources } from "../engine/blocks/blocks.js";

export default function createUI(world, player) {
    const gui = new GUI();

    // Helper function to regenerate the world
    const regenerate = () => {
        world.generate();
    };

    // ==========================
    // Player
    // ==========================
    const playerFolder = gui.addFolder("Player");

    playerFolder.add(player, "maxSpeed", 1, 20).name("Max Speed");
    playerFolder.add(player.cameraHelper, "visible").name("show Camera Helper");

    // ==========================
    // World Size
    // ==========================
    gui.add(world.size, "width", 1, 100, 1)
        .name("Width")
        .onFinishChange(regenerate);

    gui.add(world.size, "height", 1, 32, 1)
        .name("Height")
        .onFinishChange(regenerate);

    // ==========================
    // Terrain
    // ==========================
    const terrainFolder = gui.addFolder("Terrain");

    terrainFolder
        .add(world.parameters, "seed", 1, 10000, 1)
        .name("Seed")
        .onFinishChange(regenerate);

    terrainFolder
        .add(world.parameters.terrain, "scale", 10, 100)
        .name("Scale")
        .onFinishChange(regenerate);

    terrainFolder
        .add(world.parameters.terrain, "magnitude", 0, 1)
        .name("Magnitude")
        .onFinishChange(regenerate);

    terrainFolder
        .add(world.parameters.terrain, "offset", 0, 1)
        .name("Offset")
        .onFinishChange(regenerate);

    // ==========================
    // Resources
    // ==========================
    const resourcesFolder = gui.addFolder("Resources");

    resources.forEach((resource) => {
        const resourceFolder = resourcesFolder.addFolder(resource.name);

        resourceFolder
            .add(resource, "scarcity", 0, 1)
            .name("Scarcity")
            .onFinishChange(regenerate);

        resourceFolder
            .add(resource.scale, "x", 1, 100)
            .name("Scale X")
            .onFinishChange(regenerate);

        resourceFolder
            .add(resource.scale, "y", 1, 100)
            .name("Scale Y")
            .onFinishChange(regenerate);

        resourceFolder
            .add(resource.scale, "z", 1, 100)
            .name("Scale Z")
            .onFinishChange(regenerate);
    });

    return gui;
}
