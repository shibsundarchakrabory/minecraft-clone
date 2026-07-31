import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import {resources} from "../engine/blocks/blocks.js";



export default function createUI(world) {
    const gui = new GUI();

    gui.add(world.size, "width", 1, 100, 1).name("Width");

    gui.add(world.size, "height", 1, 32, 1).name("Height");

    const terrainFolder = gui.addFolder("Terrain");
    terrainFolder.add(world.parameters, "seed", 1, 10000).name("seed");
    terrainFolder.add(world.parameters.terrain, "scale", 10, 100).name("scale");
    terrainFolder.add(world.parameters.terrain, "magnitude", 0, 1).name("magnitude");
    terrainFolder.add(world.parameters.terrain, "offset", 0, 1).name("offset");

    
    const resourcesFolder = gui.addFolder("Resources");

    resources.forEach((resource) => {
        const resourceFolder = resourcesFolder.addFolder(resource.name);
        resourceFolder.add(resource, "scarcity", 0, 1).name("Scarcity");
        resourceFolder.add(resource.scale, "x", 1, 100).name("ScaleX");
        resourceFolder.add(resource.scale, "y", 1, 100).name("ScaleY");
        resourceFolder.add(resource.scale, "z", 1, 100).name("ScaleZ");
    });

    gui.onChange(() => {
        world.generate();
    });
}
