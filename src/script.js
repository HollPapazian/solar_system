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
const saturnRingTexture = textureLoader.load(
  "/textures/planets/small_ring_tex.png"
);
const spaceTexture = textureLoader.load("/textures/planets/space5-6.jpeg");
const spaceLmTexture = textureLoader.load("/textures/planets/spaceLM.jpeg");
const whiteLmTexture = textureLoader.load("/textures/planets/white.png");
///
const loader = new GLTFLoader();
const planets = {};
// Load a glTF resource
let phobos = loader.load("/models/Phobos_1_1000.glb", function (gltf) {
  gltf.scene.position.x = 5;
  gltf.scene.scale.set(0.01, 0.01, 0.01); // THREE.Group
  phobos = gltf.scene;
  planets.phobos = phobos;
  scene.add(gltf.scene);
});

let deimos;
loader.load("/models/Deimos_1_1000.glb", function (gltf) {
  gltf.scene.position.x = 5;
  gltf.scene.scale.set(0.01, 0.01, 0.01); // THREE.Group
  deimos = gltf.scene;
  planets.deimos = deimos;
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
    lightMapIntensity: 0.15,
  });
  planetGeometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(planetGeometry.attributes.uv.array, 2)
  );
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.castShadow = true;
  planet.receiveShadow = true;
  return planet;
};

const sunDiameter = 1.3927;
const sunGeometry = new THREE.SphereGeometry(sunDiameter, 64, 64);
const sunMaterial = new THREE.MeshStandardMaterial({
  map: sunTexture,
  lightMap: whiteLmTexture,
  lightMapIntensity: 1.2,
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

for (const planetName of [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "uranus",
  "neptune",
]) {
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
const moon = createPlanet("callisto", config["earth"].bigSize / 4); //new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.x = EARTH_POSITION;
planets.moon = moon;

const MARS_POSITION =
  EARTH_POSITION + currentPlanetSizes.earth + currentPlanetSizes.mars + gap;
gap += 0.2;
mars.position.x = MARS_POSITION;

const JUPITER_POSITION =
  MARS_POSITION + currentPlanetSizes.mars + currentPlanetSizes.jupiter + gap;
gap += 0.2;
jupiter.position.x = JUPITER_POSITION;

const callisto = createPlanet("callisto", config["jupiter"].bigSize / 9);
callisto.position.x = JUPITER_POSITION;

const io = createPlanet("io", config["jupiter"].bigSize / 15);
io.position.x = JUPITER_POSITION;

const europa = createPlanet("europa", config["jupiter"].bigSize / 15);
europa.position.x = JUPITER_POSITION;

const ganymede = createPlanet("ganymede", config["jupiter"].bigSize / 10);
ganymede.position.x = JUPITER_POSITION;

//
const saturnRingMaterial = new THREE.MeshStandardMaterial({
  map: saturnRingTexture,
  side: THREE.DoubleSide,
  lightMap: sunTexture,
  lightMapIntensity: 0.5,
});
const saturnMesh = createPlanet("saturn", config["saturn"].bigSize);
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

planets.callisto = callisto;
planets.io = io;
planets.europa = europa;
planets.ganymede = ganymede;

scene.add(
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  uranus,
  neptune,
  saturn,
  callisto,
  io,
  europa,
  ganymede,
  moon
);

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
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 40;
controls.minDistance = 3;

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
      for (const axis of ["x", "y", "z"]) {
        gsap.to(planets[planet].scale, {
          duration: 1,
          delay: 0,
          [axis]: config[planet].scale,
        });
      }
    }
  } else {
    for (const planet in planets) {
      for (const axis of ["x", "y", "z"]) {
        gsap.to(planets[planet].scale, {
          duration: 1,
          delay: 0,
          [axis]: config[planet].initScale || 1,
        });
      }
    }
  }
});
