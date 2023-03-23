import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { config } from "./config";
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Lights

const ambientLight = new THREE.AmbientLight(0x404040, 1.2); // soft white ambientLight scene.add( ambientLight );
// scene.add(ambientLight); 

const pointLight = new THREE.PointLight(0xffffff, 1.5, 40, 1);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 10;
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
// scene.add(pointLightCameraHelper)
scene.add(pointLight);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const sunTexture = textureLoader.load("/textures/planets/sun.jpeg");
const saturnTexture = textureLoader.load("/textures/planets/saturn.jpeg");
const saturnRingTexture = textureLoader.load(
  "/textures/planets/small_ring_tex.png"
);
const moonTexture = textureLoader.load("/textures/planets/2k_moon.jpeg");
const callistoTexture = textureLoader.load("/textures/planets/callisto.jpeg");
const ioTexture = textureLoader.load("/textures/planets/io.jpg");
const ganymedeTexture = textureLoader.load("/textures/planets/ganymede.jpeg");
const europaTexture = textureLoader.load("/textures/planets/europa.webp");
const spaceTexture = textureLoader.load("/textures/planets/space3.png");
const spaceLmTexture = textureLoader.load("/textures/planets/spaceLM.jpeg");
const whiteLmTexture = textureLoader.load("/textures/planets/white.png");
///
const loader = new GLTFLoader();

// Load a glTF resource
let phobos = loader.load("/models/Phobos_1_1000.glb", function (gltf) {
  gltf.scene.position.x = 5;
  gltf.scene.scale.set(0.01, 0.01, 0.01); // THREE.Group
  phobos = gltf.scene;
  scene.add(gltf.scene);
});

let deimos;
loader.load("/models/Deimos_1_1000.glb", function (gltf) {
  gltf.scene.position.x = 5;
  gltf.scene.scale.set(0.01, 0.01, 0.01); // THREE.Group
  deimos = gltf.scene;
  scene.add(gltf.scene);
});

/**
 * Object
 */

const planetSizes = {
  real: {
    mercury: 0.00488,
    venus: 0.012104,
    earth: 0.012742,
    mars: 0.006779,
    jupiter: 0.139822,
    saturn: 0.116464,
    saturnRingsStart: 0.13,
    saturnRingEnd: 0.4,
    uranus: 0.050724,
    neptune: 0.049244,
  },
  cinematic: {
    mercury: 0.2,
    venus: 0.5,
    earth: 0.5,
    mars: 0.3,
    jupiter: 0.8,
    saturn: 0.7,
    saturnRingsStart: 0.75,
    saturnRingEnd: 1.5,
    uranus: 0.6,
    neptune: 0.6,
  },
};

let currentPlanetSizes = {
  mercury: 0.2,
  venus: 0.5,
  earth: 0.5,
  mars: 0.3,
  jupiter: 0.8,
  saturn: 0.7,
  saturnRingsStart: 0.75,
  saturnRingEnd: 1.5,
  uranus: 0.6,
  neptune: 0.6,
};

let gap = 1;

const createPlanet = (name, size) => {
  const planetGeometry = new THREE.SphereGeometry(size, 64, 64);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load(`/textures/planets/${name}.jpeg`),
    lightMap: whiteLmTexture,
    lightMapIntensity: .15,
  });
  planetGeometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(planetGeometry.attributes.uv.array, 2)
  );
  return new THREE.Mesh(planetGeometry, planetMaterial);
};

const sunDiameter = 1.3927;
const sunGeometry = new THREE.SphereGeometry(sunDiameter, 64, 64);
const sunMaterial = new THREE.MeshStandardMaterial({
  map: sunTexture,
  lightMap: whiteLmTexture,
  lightMapIntensity: 1.2,
  // side: THREE.DoubleSide
});
sunGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sunGeometry.attributes.uv.array, 2)
);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const spaceGeometry = new THREE.SphereGeometry(150, 64, 64);
const spaceMaterial = new THREE.MeshStandardMaterial({
  map: spaceTexture,
  lightMap: spaceLmTexture,
  lightMapIntensity: 0.3,
  side: THREE.BackSide,
  ambientLight: "#000",
});
const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
space.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(space.geometry.attributes.uv.array, 2)
);
scene.add(space);

const planets = {};

for (const planetName of [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "uranus",
  "neptune",
]) {
  if (planetName === "saturn") {
    continue;
  }
  planets[planetName] = createPlanet(planetName, config[planetName].bigSize);
}

const { mercury, venus, earth, mars, jupiter, uranus, neptune } = planets;

const MERCURY_POSITION = sunDiameter + currentPlanetSizes.mercury + gap;
gap += 0.2;
mercury.position.x = MERCURY_POSITION;
scene.add(mercury);

const VENUS_POSITION =
  MERCURY_POSITION +
  currentPlanetSizes.mercury +
  currentPlanetSizes.venus +
  gap;
gap += 0.2;
venus.position.x = VENUS_POSITION;

const EARTH_POSITION =
  VENUS_POSITION + currentPlanetSizes.venus + currentPlanetSizes.earth + gap;
gap += 0.2;
earth.position.x = EARTH_POSITION;
earth.castShadow = true;
earth.receiveShadow = true;

// moon
const moonGeometry = new THREE.SphereGeometry(
  currentPlanetSizes.earth / 4,
  64,
  64
);
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.x = EARTH_POSITION;
moon.castShadow = true;
moon.receiveShadow = true;
scene.add(moon);

const MARS_POSITION =
  EARTH_POSITION + currentPlanetSizes.earth + currentPlanetSizes.mars + gap;
gap += 0.2;
mars.position.x = MARS_POSITION;

const JUPITER_POSITION =
  MARS_POSITION + currentPlanetSizes.mars + currentPlanetSizes.jupiter + gap;
gap += 0.2;
jupiter.position.x = JUPITER_POSITION;
jupiter.castShadow = true;
jupiter.receiveShadow = true;

const callistoGeometry = new THREE.SphereGeometry(
  currentPlanetSizes.jupiter / 9,
  64,
  64
);
const callistoMaterial = new THREE.MeshStandardMaterial({
  map: callistoTexture,
});
const callisto = new THREE.Mesh(callistoGeometry, callistoMaterial);
callisto.position.x = JUPITER_POSITION;
callisto.castShadow = true;
callisto.receiveShadow = true;
scene.add(callisto);

const ioGeometry = new THREE.SphereGeometry(
  currentPlanetSizes.jupiter / 15,
  64,
  64
);
const ioMaterial = new THREE.MeshStandardMaterial({
  map: ioTexture,
});
const io = new THREE.Mesh(ioGeometry, ioMaterial);
io.position.x = JUPITER_POSITION;
io.castShadow = true;
io.receiveShadow = true;
scene.add(io);

const europaGeometry = new THREE.SphereGeometry(
  currentPlanetSizes.jupiter / 15,
  64,
  64
);
const europaMaterial = new THREE.MeshStandardMaterial({
  map: europaTexture,
});
const europa = new THREE.Mesh(europaGeometry, europaMaterial);
europa.position.x = JUPITER_POSITION;
europa.castShadow = true;
europa.receiveShadow = true;
scene.add(europa);

const ganymedeGeometry = new THREE.SphereGeometry(
  currentPlanetSizes.jupiter / 10,
  64,
  64
);
const ganymedeMaterial = new THREE.MeshStandardMaterial({
  map: ganymedeTexture,
});
const ganymede = new THREE.Mesh(ganymedeGeometry, ganymedeMaterial);
ganymede.position.x = JUPITER_POSITION;
ganymede.castShadow = true;
ganymede.receiveShadow = true;
scene.add(ganymede);

//

const saturnGeometry = new THREE.SphereGeometry(
  currentPlanetSizes.saturn,
  64,
  64
);
const saturnMaterial = new THREE.MeshStandardMaterial({
  map: saturnTexture,
  // side: THREE.DoubleSide,
  lightMap: whiteLmTexture,
  lightMapIntensity: .13,
});
const saturnRingMaterial = new THREE.MeshStandardMaterial({
  map: saturnRingTexture,
  side: THREE.DoubleSide,
  lightMap: sunTexture,
  lightMapIntensity: 0.5,
});
const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
const saturnRingGeometry = new THREE.RingGeometry(
  currentPlanetSizes.saturnRingsStart,
  currentPlanetSizes.saturnRingEnd,
  32
);
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.rotation.x = Math.PI / 2;
const saturn = new THREE.Group();
saturn.add(saturnMesh);
saturn.add(saturnRing);
const SATURN_POSITION =
  JUPITER_POSITION +
  currentPlanetSizes.jupiter +
  currentPlanetSizes.saturnRingEnd +
  gap;
gap += 0.2;
saturn.position.x = SATURN_POSITION;
planets.saturn = saturn;

const URANUS_POSITION =
  SATURN_POSITION +
  currentPlanetSizes.saturnRingEnd +
  currentPlanetSizes.uranus +
  gap;
gap += 0.2;
uranus.position.x = URANUS_POSITION;

const NEPTUNE_POSITION =
  URANUS_POSITION +
  currentPlanetSizes.uranus +
  currentPlanetSizes.neptune +
  gap;
gap += 0.2;
neptune.position.x = NEPTUNE_POSITION;

scene.add(mercury, venus, earth, mars, jupiter, uranus, neptune, saturn);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = 1;
camera.position.y = 10;
camera.position.z = 14;
// camera.lookAt(10, 10, 10);
// camera.far = 1000
// camera.near = 1
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  sun.rotation.y = elapsedTime * Math.PI * 0.05;

  mercury.rotation.y = elapsedTime * Math.PI * 0.12;
  mercury.position.x = Math.sin(elapsedTime) * MERCURY_POSITION;
  mercury.position.z = Math.cos(elapsedTime) * MERCURY_POSITION;

  venus.rotation.y = elapsedTime * Math.PI * 0.2;
  venus.position.x = Math.sin(elapsedTime / 2) * VENUS_POSITION;
  venus.position.z = Math.cos(elapsedTime / 2) * VENUS_POSITION;

  earth.rotation.y = elapsedTime * Math.PI * 0.1;
  earth.position.x = Math.sin(elapsedTime / 3) * EARTH_POSITION;
  earth.position.z = Math.cos(elapsedTime / 3) * EARTH_POSITION;

  moon.rotation.y = elapsedTime * Math.PI * 0.1;
  moon.position.x =
    Math.sin(elapsedTime * 1.5) * earth.scale.x + earth.position.x;
  moon.position.z =
    Math.cos(elapsedTime * 1.5) * earth.scale.x + earth.position.z;

  mars.rotation.y = elapsedTime * Math.PI * 0.15;
  mars.position.x = Math.sin(elapsedTime / 4) * MARS_POSITION;
  mars.position.z = Math.cos(elapsedTime / 4) * MARS_POSITION;

  if (phobos) {
    phobos.rotation.y = elapsedTime * Math.PI * 0.1;
    phobos.position.x = Math.sin(elapsedTime * 1.4) * 0.5 + mars.position.x;
    phobos.position.z = Math.cos(elapsedTime * 1.4) * 0.5 + mars.position.z;
  }

  if (deimos) {
    deimos.rotation.y = elapsedTime * Math.PI * 0.1;
    deimos.position.x = Math.sin(elapsedTime * 1.8 + 1) * 0.7 + mars.position.x;
    deimos.position.z = Math.cos(elapsedTime * 1.8 + 1) * 0.7 + mars.position.z;
  }

  //

  jupiter.rotation.y = elapsedTime * Math.PI * 0.1;
  jupiter.position.x = Math.sin(elapsedTime / 5) * JUPITER_POSITION;
  jupiter.position.z = Math.cos(elapsedTime / 5) * JUPITER_POSITION;

  callisto.rotation.y = elapsedTime * Math.PI * 0.2;
  callisto.position.x =
    Math.sin(elapsedTime * 1) * 1 * jupiter.scale.x + jupiter.position.x;
  callisto.position.z =
    Math.cos(elapsedTime * 1) * 1 * jupiter.scale.x + jupiter.position.z;

  io.rotation.y = elapsedTime * Math.PI * 0.1;
  io.position.x =
    Math.sin(elapsedTime * 1.2 + 0.8) * 1.3 * jupiter.scale.x +
    jupiter.position.x;
  io.position.z =
    Math.cos(elapsedTime * 1.2 + 0.8) * 1.3 * jupiter.scale.x +
    jupiter.position.z;

  europa.rotation.y = elapsedTime * Math.PI * 0.3;
  europa.position.x =
    Math.sin(elapsedTime * 1.4 + 1.6) * 1.5 * jupiter.scale.x +
    jupiter.position.x;
  europa.position.z =
    Math.cos(elapsedTime * 1.4 + 1.6) * 1.5 * jupiter.scale.x +
    jupiter.position.z;

  ganymede.rotation.y = elapsedTime * Math.PI * 0.5;
  ganymede.position.x =
    Math.sin(elapsedTime * 1.6 + 2.4) * 1.2 * jupiter.scale.x +
    jupiter.position.x;
  ganymede.position.z =
    Math.cos(elapsedTime * 1.6 + 2.4) * 1.2 * jupiter.scale.x +
    jupiter.position.z;

  //

  saturn.rotation.y = elapsedTime * Math.PI * 0.1;
  saturn.position.x = Math.sin(elapsedTime / 6) * SATURN_POSITION;
  saturn.position.z = Math.cos(elapsedTime / 6) * SATURN_POSITION;

  uranus.rotation.y = elapsedTime * Math.PI * 0.1;
  uranus.position.x = Math.sin(elapsedTime / 7) * URANUS_POSITION;
  uranus.position.z = Math.cos(elapsedTime / 7) * URANUS_POSITION;

  neptune.rotation.y = elapsedTime * Math.PI * 0.1;
  neptune.position.x = Math.sin(elapsedTime / 8) * NEPTUNE_POSITION;
  neptune.position.z = Math.cos(elapsedTime / 8) * NEPTUNE_POSITION;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

document.querySelector("button").addEventListener("click", () => {
  if (uranus.scale.x === 1) {
    for (const planet in planets) {
      gsap.to(planets[planet].scale, {
        duration: 1,
        delay: 0,
        x: config[planet].scale,
      });
      gsap.to(planets[planet].scale, {
        duration: 1,
        delay: 0,
        y: config[planet].scale,
      });
      gsap.to(planets[planet].scale, {
        duration: 1,
        delay: 0,
        z: config[planet].scale,
      });
    }
  } else {
    for (const planet in planets) {
      gsap.to(planets[planet].scale, { duration: 1, delay: 0, x: 1 });
      gsap.to(planets[planet].scale, { duration: 1, delay: 0, y: 1 });
      gsap.to(planets[planet].scale, { duration: 1, delay: 0, z: 1 });
    }
  }
});
