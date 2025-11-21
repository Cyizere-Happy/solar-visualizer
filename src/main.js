import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { bufferAttribute, color, Const, distance, step } from 'three/tsl';
import { Pane } from 'tweakpane';


//For us to even Render we need a scene that contains everything
const scene = new THREE.Scene();

//Creating Camera
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 400)
camera.position.z = 100;
camera.position.y = 5;
scene.add(camera)

//Generating Textures

//textureLoader 
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
cubeTextureLoader.setPath('static/Textures/Cube-Map/')


//Adding Materials & Texture

const sunTexture = textureLoader.load('static/Textures/2k_sun.jpg')
const earthTexture = textureLoader.load('static/Textures/2k_earth_daymap.jpg')
const marsTexture = textureLoader.load('static/Textures/2k_mars.jpg')
const mercuryTexture = textureLoader.load('static/Textures/2k_mercury.jpg')
const venusTexture = textureLoader.load('static/Textures/2k_venus_surface.jpg')
const moonTexture = textureLoader.load('static/Textures/2k_moon.jpg')

const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture
})
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture
})
const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture
})
const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture
})
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture
})
const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture
})

const backgroundCubemap = cubeTextureLoader
.load( [
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png'
] );

scene.background = backgroundCubemap



//Creating Meshes
const SphereGeometry = new THREE.SphereGeometry(1, 32, 32)

//Meshes

//sun
const sun = new THREE.Mesh(
  SphereGeometry,
  sunMaterial
)
sun.scale.setScalar(5)

scene.add(sun)


//Planetary Array
const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
];


const createPlanet = (planet) =>{
  const planetMesh = new THREE.Mesh(
    SphereGeometry,
    planet.material
  )
  planetMesh.scale.setScalar(planet.radius)
  planetMesh.position.x = planet.distance
  return planetMesh
}

const createMoon = (moon) =>{
  const moonMesh = new THREE.Mesh(
    SphereGeometry,
    moonMaterial
  )
  moonMesh.scale.setScalar(moon.radius)
  moonMesh.position.x = moon.distance
  return moonMesh
}


const planetMeshes = planets.map((planet) =>{
  const planetMesh = createPlanet(planet)
  scene.add(planetMesh)

  planet.moons.forEach((moon) => {
    const moonMesh = createMoon(moon)
    planetMesh.add(moonMesh)
  })
  return planetMesh
})

//add lights
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

const canvas = document.querySelector('.threejs')
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true

})
renderer.setSize(window.innerWidth, window.innerHeight)


const Controls = new OrbitControls(camera, canvas)
Controls.enableDamping = true;

//first looked at my devicePixelRatio
console.log(window.devicePixelRatio)

//Happens only when one resizes not each and everytime
window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight
    //to update the parameters given to the camera function
    camera.updateProjectionMatrix()
    //For resizing the size won't always be the same to avoid streching
    renderer.setSize(window.innerWidth, window.innerHeight)  
})

//Initialize clock
const clock = new THREE.Clock()
let previousTime = 0;

const renderLoop = () =>{
  planetMeshes.forEach((planet, index) =>{
    planet.rotation.y += planets[index].speed
    planet.position.x = Math.sin(planet.rotation.y) * planets[index].distance
    planet.position.z = Math.cos(planet.rotation.y) * planets[index].distance
    planet.children.forEach((moon, moonIndex) =>{
      moon.rotation.y += planets[index].moons[moonIndex].speed
      moon.position.x = Math.sin(moon.rotation.y) * planets[index].moons[moonIndex].distance
      moon.position.z = Math.cos(moon.rotation.y) * planets[index].moons[moonIndex].distance
    })
  })
  
    Controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(renderLoop)
}

renderLoop()




