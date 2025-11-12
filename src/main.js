import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { color, Const } from 'three/tsl';


//For us to even Render we need a scene that contains everything
const scene = new THREE.Scene();

//Geometry and Material
const cubeGeometry = new THREE.BoxGeometry(1,1,1);
const cubeMaterial = new THREE.MeshBasicMaterial({color: 'blue'})

//Mesh takes two parameters there is the geometry and Material 
const CubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)

scene.add(CubeMesh) 

//Objects that are farther away look smaller, and closer ones look bigger. (Mimics Human Behaviour)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30)

//OrthographicCamera Objects look the same size no matter how far they are from the camera.
// const aspectRatio = window.innerWidth/window.innerHeight;
// const camera = new THREE.OrthographicCamera(-1*aspectRatio,1*aspectRatio,1,-1,0.1,200)
camera.position.z = 5;

scene.add(camera)



const canvas = document.querySelector('.threejs')
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true

})
renderer.setSize(window.innerWidth, window.innerHeight)


const Controls = new OrbitControls(camera, canvas)
Controls.enableDamping = true;
Controls.autoRotate = true;

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

//For the renderLoop we prevent the thing to only render an Image each and everytime only
const renderLoop = () =>{
    Controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(renderLoop)
}

renderLoop()




