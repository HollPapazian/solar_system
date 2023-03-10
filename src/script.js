import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Lights

const ambientLight = new THREE.AmbientLight(0x404040, 0.2); // soft white ambientLight scene.add( ambientLight );
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5, 20, 1);
// pointLight.position.set( 50, 50, 50 );.
scene.add(pointLight);

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("loadingManager: loading started");
};
loadingManager.onLoad = () => {
  console.log("loadingManager: loading finished");
};
loadingManager.onProgress = () => {
  console.log("loadingManager: loading progressing");
};
loadingManager.onError = () => {
  console.log("loadingManager: loading error");
};

const textureLoader = new THREE.TextureLoader(loadingManager);

const mercuryTexture = textureLoader.load("/textures/planets/2k_mercury.jpeg");
const sunTexture = textureLoader.load("/textures/planets/2k_sun.jpeg");
const earthTexture = textureLoader.load(
  "/textures/planets/2k_earth_daymap.jpeg"
);
const venusTexture = textureLoader.load(
  "/textures/planets/2k_venus_surface.jpeg"
);
const marsTexture = textureLoader.load("/textures/planets/2k_mars.jpeg");
const jupiterTexture = textureLoader.load("/textures/planets/2k_jupiter.jpeg");
const saturnTexture = textureLoader.load("/textures/planets/2k_saturn.jpeg");
const saturnRingTexture = textureLoader.load("/textures/planets/small_ring_tex.png");
const uranusTexture = textureLoader.load("/textures/planets/2k_uranus.jpeg");
const neptuneTexture = textureLoader.load("/textures/planets/2k_neptune.jpeg");

/**
 * Object
 */

const sunGeometry = new THREE.SphereGeometry(1, 64, 64);

const sunMaterial = new THREE.MeshStandardMaterial({
  map: sunTexture,
  lightMap: sunTexture,
  lightMapIntensity: 1,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const mercuryGeometry = new THREE.SphereGeometry(0.2, 64, 64);
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
const MERCURY_POSITION = 2;
mercury.position.x = MERCURY_POSITION;
scene.add(mercury);

const venusGeometry = new THREE.SphereGeometry(0.3, 64, 64);
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const venus = new THREE.Mesh(venusGeometry, venusMaterial);
const VENUS_POSITION = 3;
venus.position.x = VENUS_POSITION;
scene.add(venus);

const earthGeometry = new THREE.SphereGeometry(0.5, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
const EARTH_POSITION = 4.5;
earth.position.x = EARTH_POSITION;
scene.add(earth);

const marsGeometry = new THREE.SphereGeometry(0.4, 64, 64);
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
const MARS_POSITION = 6;
mars.position.x = MARS_POSITION;
scene.add(mars);

const jupiterGeometry = new THREE.SphereGeometry(0.8, 64, 64);
const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
const JUPITER_POSITION = 8;
jupiter.position.x = JUPITER_POSITION;
scene.add(jupiter);

const saturnGeometry = new THREE.SphereGeometry(0.7, 64, 64);
const saturnMaterial = new THREE.MeshStandardMaterial({
  map: saturnTexture,
  side: THREE.DoubleSide,
});
const saturnRingMaterial = new THREE.MeshStandardMaterial({
  map: saturnRingTexture,
  side: THREE.DoubleSide,
});
const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
const saturnRingGeometry = new THREE.RingGeometry(0.75, 1.2, 32);
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.rotation.x = Math.PI / 4;
const saturn = new THREE.Group();
saturn.add(saturnMesh)
saturn.add(saturnRing)
const SATURN_POSITION = 10.5;
saturn.position.x = SATURN_POSITION;
scene.add(saturn);

const uranusGeometry = new THREE.SphereGeometry(0.6, 64, 64);
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
const URANUS_POSITION = 13;
uranus.position.x = URANUS_POSITION;
scene.add(uranus);

const neptuneGeometry = new THREE.SphereGeometry(0.6, 64, 64);
const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
const NEPTUNE_POSITION = 15;
neptune.position.x = NEPTUNE_POSITION;
scene.add(neptune);


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
  100
);
camera.position.x = 1;
camera.position.y = 10;
camera.position.z = 14;
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

// function movePlanet ({planet, rotation, year, position}){
//   planet.rotation.y = elapsedTime * Math.PI * rotation;
//   planet.position.x = Math.sin(elapsedTime / year) * position
//   planet.position.z = Math.cos(elapsedTime / year) * position
// }

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  sun.rotation.y = elapsedTime * Math.PI * 0.05;
  
  mercury.rotation.y = elapsedTime * Math.PI * 0.12;
  mercury.position.x = Math.sin(elapsedTime) * MERCURY_POSITION
  mercury.position.z = Math.cos(elapsedTime) * MERCURY_POSITION
  
  venus.rotation.y = elapsedTime * Math.PI * 0.2;
  venus.position.x = Math.sin(elapsedTime / 2.6) * VENUS_POSITION
  venus.position.z = Math.cos(elapsedTime / 2.6) * VENUS_POSITION
  
  earth.rotation.y = elapsedTime * Math.PI * 0.1;
  earth.position.x = Math.sin(elapsedTime / 4.1) * EARTH_POSITION
  earth.position.z = Math.cos(elapsedTime / 4.1) * EARTH_POSITION
  
  mars.rotation.y = elapsedTime * Math.PI * 0.15;
  mars.position.x = Math.sin(elapsedTime / 7.9) * MARS_POSITION
  mars.position.z = Math.cos(elapsedTime / 7.9) * MARS_POSITION
  
  jupiter.rotation.y = elapsedTime * Math.PI * 0.1;
  jupiter.position.x = Math.sin(elapsedTime / 10) * JUPITER_POSITION
  jupiter.position.z = Math.cos(elapsedTime / 10) * JUPITER_POSITION

  saturn.rotation.y = elapsedTime * Math.PI * 0.1;
  saturn.position.x = Math.sin(elapsedTime / 13) * SATURN_POSITION
  saturn.position.z = Math.cos(elapsedTime / 13) * SATURN_POSITION

  uranus.rotation.y = elapsedTime * Math.PI * 0.1;
  uranus.position.x = Math.sin(elapsedTime / 16) * URANUS_POSITION
  uranus.position.z = Math.cos(elapsedTime / 16) * URANUS_POSITION

  neptune.rotation.y = elapsedTime * Math.PI * 0.1;
  neptune.position.x = Math.sin(elapsedTime / 20) * NEPTUNE_POSITION
  neptune.position.z = Math.cos(elapsedTime / 20) * NEPTUNE_POSITION


  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
