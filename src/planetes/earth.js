import * as THREE from "three";

const earthGeometry = new THREE.SphereGeometry(
  currentPlanetSizes.earth,
  64,
  64
);
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  normalMap: earthNormalTexture,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
const EARTH_POSITION =
  VENUS_POSITION + currentPlanetSizes.venus + currentPlanetSizes.earth + gap;
gap += 0.2;
earth.position.x = EARTH_POSITION;
earth.castShadow = true;
earth.receiveShadow = true;
scene.add(earth);
planets.push(earth);

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
