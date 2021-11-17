import "./styles/main.css";
import "./assets/images/logo.png";
import "./cat.jpg";
import "./cloud.png";
import "./script/vanillascript.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// Texture loader
const loader = new THREE.TextureLoader();
const star = loader.load("star.png");

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Lights
let light = new THREE.AmbientLight(0x555555);

// Objects
const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);

const particlesGeometry = new THREE.BufferGeometry();
// sets how many particles are in the scene
const particlesCount = 5000;

const posArray = new Float32Array(particlesCount * 3);
// xyz, xyz, xyz, xyz

for (let i = 0; i < particlesCount * 3; i++) {
  // Not centered:
  // posArray[i] = Math.random();

  // To center:
  // posArray[i] = Math.random() - 0.5;

  // To enlarge to take up the whole canvas:
  posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);

// Takes pos array from for loop, takes each math.random() value and sets the particle geometry value to all 5000 particles

// Materials

const material = new THREE.PointsMaterial({ transparent: true, size: 0.005 });
// material.color = new THREE.Color(0xff0000);

// Particles Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.035,
  map: star,
  transparent: true,
  color: "green",
  blending: THREE.AdditiveBlending,
});

// Mesh
const sphere = new THREE.Points(geometry, material);
sphere.rotation.y = 1;
scene.add(sphere);
scene.add(light);

// Particle system mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(sphere, particlesMesh);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth / 2,
  height: window.innerHeight / 2,
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
camera.position.x = 1.16;
camera.position.y = -0.12;
camera.position.z = 1;
camera.rotation.z = 0.27;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// sets bg color of three js scene
// renderer.setClearColor(new THREE.Color("#21282a"), 1);

// Fog effect
scene.fog = new THREE.FogExp2(0x03544e, 0.001);
renderer.setClearColor(scene.fog.color);
// document.body.appendChild(renderer.domElement);

let loaderCloud = new THREE.TextureLoader();
loaderCloud.load("cloud.png", function (texture) {
  let cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
  let cloudMaterial = new THREE.MeshLambertMaterial({
    map: texture,
    transparent: true,
  });

  for (let p = 0; p < 50; p++) {
    let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
    cloud.position.set(
      Math.random() * 800 - 400,
      500,
      Math.random() * 500 - 500
    );
    cloud.rotation.x = 1.16;
    cloud.rotation.y = -0.12;
    cloud.rotation.z = Math.random() * 2 * Math.PI;
    cloud.material.opacity = 0.55;
    // cloudParticles.push(cloud);
    scene.add(cloud);
    console.log(cloud);
  }
});

// Mouse

document.addEventListener("mousemove", animateParticles);

let mouseX = 0;
let mouseY = 0;

function animateParticles(event) {
  mouseY = event.clientY;
  mouseX = event.clientX;
}

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  // const elapsedTime = clock.getElapsedTime();
  // const deltaTime = clock.getDelta();

  // Update objects
  sphere.rotation.y += 0.005;
  particlesMesh.rotation.y += 0.001;

  if (mouseX > 0) {
    // particlesMesh.rotation.y += mouseY * 0.01 + 1;
    // particlesMesh.rotation.x -= (mouseX + 100) * 0.0002 * deltaTime;
  }

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
