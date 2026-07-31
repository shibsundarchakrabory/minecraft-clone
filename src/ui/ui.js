import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

export default function createUI(world) {
    const gui = new GUI();

    gui.add(world.size, "width", 1, 64, 1).name("Width");

    gui.add(world.size, "height", 1, 32, 1).name("Height");

    const terrainFolder = gui.addFolder("Terrain");

    terrainFolder.add(world.parameters, "seed", 1, 10000).name("seed");
    terrainFolder.add(world.parameters.terrain, "scale", 10, 100).name("scale");
    terrainFolder.add(world.parameters.terrain, "magnitude", 0, 1).name("magnitude");
    terrainFolder.add(world.parameters.terrain, "offset", 0, 1).name("offset");

    gui.onChange(() => {
        world.generate();
    });
}
