import * as THREE from "three";
import { config } from "../config";

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load(
  "/textures/planets/2k_earth_daymap.jpeg"
);
const moonTexture = textureLoader.load("/textures/planets/2k_moon.jpeg");

const earthGeometry = new THREE.SphereGeometry(config.earth.size, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true;
earth.receiveShadow = true;

// moon
const moonGeometry = new THREE.SphereGeometry(config.earth.size / 4, 64, 64);
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
// moon.position.x = EARTH_POSITION;
moon.castShadow = true;
moon.receiveShadow = true;

export { earth, moon };
