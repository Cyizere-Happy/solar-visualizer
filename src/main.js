import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Pane } from 'tweakpane';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 400);
camera.position.set(0, 5, 100);
scene.add(camera);

// Renderer
const canvas = document.querySelector('.threejs');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('/Textures/Cube-Map/'); // absolute path from public

// Load Planet Textures
const sunTexture = textureLoader.load('/Textures/2k_sun.jpg');
const earthTexture = textureLoader.load('/Textures/2k_earth_daymap.jpg');
const marsTexture = textureLoader.load('/Textures/2k_mars.jpg');
const mercuryTexture = textureLoader.load('/Textures/2k_mercury.jpg');
const venusTexture = textureLoader.load('/Textures/2k_venus_surface.jpg');
const moonTexture = textureLoader.load('/Textures/2k_moon.jpg');

// Materials
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });

// Cube Map as Background
scene.background = cubeTextureLoader.load([
  'px.png', 'nx.png',
  'py.png', 'ny.png',
  'pz.png', 'nz.png'
]);

// Geometry
const SphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// Sun
const sun = new THREE.Mesh(SphereGeometry, sunMaterial);
sun.scale.setScalar(5);
scene.add(sun);

// Planets & Moons
const planets = [
  { name: "Mercury", radius: 0.5, distance: 10, speed: 0.01, material: mercuryMaterial, moons: [] },
  { name: "Venus", radius: 0.8, distance: 15, speed: 0.007, material: venusMaterial, moons: [] },
  { 
    name: "Earth", radius: 1, distance: 20, speed: 0.005, material: earthMaterial,
    moons: [{ name: "Moon", radius: 0.3, distance: 3, speed: 0.015 }]
  },
  { 
    name: "Mars", radius: 0.7, distance: 25, speed: 0.003, material: marsMaterial,
    moons: [
      { name: "Phobos", radius: 0.1, distance: 2, speed: 0.02 },
      { name: "Deimos", radius: 0.2, distance: 3, speed: 0.015 }
    ]
  }
];

// Helper functions
const createPlanet = (planet) => {
  const mesh = new THREE.Mesh(SphereGeometry, planet.material);
  mesh.scale.setScalar(planet.radius);
  mesh.position.x = planet.distance;
  return mesh;
};

const createMoon = (moon) => {
  const mesh = new THREE.Mesh(SphereGeometry, moonMaterial);
  mesh.scale.setScalar(moon.radius);
  mesh.position.x = moon.distance;
  return mesh;
};

// Create Planet Meshes
const planetMeshes = planets.map((planet) => {
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);

  planet.moons.forEach((moon) => {
    const moonMesh = createMoon(moon);
    planetMesh.add(moonMesh);
  });

  return planetMesh;
});

// Lights
const ambientLight = new THREE.AmbientLight(
  0xffffff,
  0.3
)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(
  0xffffff,
  1000
)
scene.add(pointLight)

// Responsive Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();

  planetMeshes.forEach((planet, i) => {
    planet.rotation.y += planets[i].speed;
    planet.position.x = Math.sin(planet.rotation.y) * planets[i].distance;
    planet.position.z = Math.cos(planet.rotation.y) * planets[i].distance;

    planet.children.forEach((moon, mi) => {
      moon.rotation.y += planets[i].moons[mi].speed;
      moon.position.x = Math.sin(moon.rotation.y) * planets[i].moons[mi].distance;
      moon.position.z = Math.cos(moon.rotation.y) * planets[i].moons[mi].distance;
    });
  });

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
