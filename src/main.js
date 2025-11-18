import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { bufferAttribute, color, Const } from 'three/tsl';


//For us to even Render we need a scene that contains everything
const scene = new THREE.Scene();

//Creating a bufferGeometry

// const verticles = new Float32Array([0,0,0,2,0,0,0,2,0])
// const attribute = new THREE.BufferAttribute(verticles, 3)
// const geometry = new THREE.BufferGeometry()
// geometry.setAttribute("position", attribute)



//Geometry and Material
const cubeGeometry = new THREE.BoxGeometry(1,1,1);
const cubeMaterial = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true})
const geometry = new THREE.SphereGeometry(1, 16,16)

//Mesh takes two parameters there is the geometry and Material 
const CubeMesh = new THREE.Mesh(geometry, cubeMaterial)
scene.add(CubeMesh)
// const CubeMesh1 = new THREE.Mesh(cubeGeometry, cubeMaterial)
// CubeMesh.scale.setScalar(0.5)
// CubeMesh1.position.x = -2;

// const CubeMesh2 = new THREE.Mesh(cubeGeometry, cubeMaterial)
// CubeMesh2.position.x = 2

// const group = new THREE.Group();
// group.add(CubeMesh)
// group.add(CubeMesh1)
// group.add(CubeMesh2)

// group.position.y = 1;
// group.scale.setScalar(2)

// scene.add(group)


// scene.add(CubeMesh) 

//Objects that are farther away look smaller, and closer ones look bigger. (Mimics Human Behaviour)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30)

//OrthographicCamera Objects look the same size no matter how far they are from the camera.
// const aspectRatio = window.innerWidth/window.innerHeight;
// const camera = new THREE.OrthographicCamera(-1*aspectRatio,1*aspectRatio,1,-1,0.1,200)
camera.position.z = 5;
camera.position.x = 0;
camera.position.y = 1;



// const tempVector = new THREE.Vector3(0,-1,0)
// CubeMesh.position.copy(tempVector)
// CubeMesh.position.x = 1; without using the position property
// CubeMesh.position.y = 1;

//You can look at the camera position from the object you are working with
const distanceToCamera = CubeMesh.position.distanceTo(camera.position)
console.log(distanceToCamera)

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper)

scene.add(camera)



const canvas = document.querySelector('.threejs')
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true

})
renderer.setSize(window.innerWidth, window.innerHeight)


const Controls = new OrbitControls(camera, canvas)
Controls.enableDamping = true;
Controls.autoRotate = false;

//first looked at my devicePixelRatio
console.log(window.devicePixelRatio)

//Happens only when one resizes not each and everytime
window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight
    //to update the parameters given to the camera function
    camera.updateProjectionMatrix()
    //For resizing the size won't always be the same to avoid streching
    renderer.setSize(window.innerWidth, window.innerHeight)

    //removing the Staircase illusion by adding more pixels for it to be less noticable
    // const maxPixelRatio = Math.min(window.devicePixelRatio, 1.5);
    
    // renderer.setPixelRatio(maxPixelRatio)


    // renderer.setPixelRatio(window.devicePixelRatio) small phones has many pixels since it has less computing power so now when you do that you are using way too much unecessary pixels
  
})

//Initialize clock
const clock = new THREE.Clock()
let previousTime = 0;

//For the renderLoop we prevent the thing to only render an Image each and everytime only
const renderLoop = () =>{

    const currentTime = clock.getElapsedTime()
    const delta = currentTime-previousTime
    previousTime = currentTime
    CubeMesh.rotation.y += THREE.MathUtils.degToRad(100) * delta 

    Controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(renderLoop)
}

renderLoop()




