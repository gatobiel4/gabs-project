import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, ParticleSystem, Texture, Color4 } from '@babylonjs/core';

export const createMainMenuScene = (engine: Engine): Scene => {
    const scene = new Scene(engine);
    // A dark, atmospheric start screen color
    scene.clearColor = new Color4(0.05, 0.05, 0.1, 1);

    const camera = new FreeCamera('menu-camera', new Vector3(0, 5, -15), scene);
    camera.setTarget(Vector3.Zero());
    // Notice we don't attach controls here so the user can't move the camera randomly on the main menu

    const light = new HemisphericLight('menu-light', new Vector3(0, 1, 0), scene);
    light.intensity = 0.5;

    // Let's add a simple floating particle effect to make the background feel alive
    // Note: For a serious particle system, we'd load a texture, but we'll use a basic box for now
    const particleSystem = new ParticleSystem('menu-particles', 500, scene);
    // Default texture for point particles
    particleSystem.particleTexture = new Texture('https://assets.babylonjs.com/textures/flare.png', scene);

    // Emit points from a large box area
    particleSystem.createBoxEmitter(new Vector3(0, 1, 0), new Vector3(0, 1, 0), new Vector3(-20, -10, -5), new Vector3(20, 10, 5));

    // Colors of particles
    particleSystem.color1 = new Color4(0.4, 0.6, 1.0, 1.0);
    particleSystem.color2 = new Color4(0.2, 0.4, 1.0, 1.0);
    particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

    // Size constraints
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;

    // Life time
    particleSystem.minLifeTime = 2.0;
    particleSystem.maxLifeTime = 8.0;

    // Emission rate
    particleSystem.emitRate = 30;

    // Gravity/Movement
    particleSystem.gravity = new Vector3(0, 0.5, 0); // Float slightly up
    particleSystem.minEmitPower = 0.1;
    particleSystem.maxEmitPower = 0.5;
    particleSystem.updateSpeed = 0.01;

    particleSystem.start();

    return scene;
};
