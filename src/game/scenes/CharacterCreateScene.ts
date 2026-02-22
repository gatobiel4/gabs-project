import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';

export const createCharacterCreateScene = (engine: Engine): Scene => {
    const scene = new Scene(engine);
    // Give this scene a different background color so it's easy to tell them apart
    scene.clearColor = new Color3(0.1, 0.1, 0.2).toColor4(1);

    const camera = new FreeCamera('cc-camera', new Vector3(0, 2, -5), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(engine.getRenderingCanvas(), true);

    const light = new HemisphericLight('cc-light', new Vector3(0, 1, 0), scene);
    light.intensity = 0.9;

    // A basic pedestal for the character to stand on
    const pedestal = MeshBuilder.CreateCylinder('pedestal', { diameter: 3, height: 0.5 }, scene);
    pedestal.position.y = -0.25;

    const mat = new StandardMaterial('pedestal-mat', scene);
    mat.diffuseColor = new Color3(0.4, 0.4, 0.5);
    pedestal.material = mat;

    return scene;
};
