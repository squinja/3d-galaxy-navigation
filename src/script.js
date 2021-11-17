import "./styles/main.css";
import "./assets/images/logo.png";
import "./cat.jpg";
import "./stars.jpg";
import "./cloud.png";

import * as VANILLA from "./script/vanillascript.js";
import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
// import { EffectPass } from "./EffectPass";

import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
// This is a SEPARATE 3js library
import {
  BloomEffect,
  BlendFunction,
  KernelSize,
  // EffectPass,
  TextureEffect,
} from "postprocessing";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "stats.js";

import * as dat from "dat.gui";
import { CubeCamera, TextureLoader } from "three";

// Stats: GPU usage

let stats;

function createStats() {
  var stats = new Stats();
  stats.setMode(0);
  stats.showPanel(1);

  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0";
  stats.domElement.style.top = "0";

  return stats;
}

// Texture loader
const loader = new THREE.TextureLoader();
const star = loader.load("star.png");
const cloud = loader.load("cloud.png");

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Lights
let light = new THREE.AmbientLight(0x999);

// spiral galaxy section

// Galaxy Arm

const galaxyArmPoints = [];
const galaxyArmSize = 1000;
let normArm,
  distanceArm,
  phiArm,
  thetaArm,
  thetaVariationArm,
  armOne,
  armTwo,
  armThree,
  armFour,
  armFive,
  galaxyArmGeometry;

for (let i = 0; i < 100; i++) {
  normArm = i / 400;
  thetaVariationArm = THREE.Math.randFloatSpread(0.5);
  thetaArm = normArm * Math.PI + thetaVariationArm;
  phiArm = THREE.Math.randFloatSpread(0.1);
  distanceArm = normArm * galaxyArmSize;

  armOne = new THREE.Vector3(
    distanceArm * Math.sin(thetaArm) * Math.cos(phiArm),
    distanceArm * Math.sin(thetaArm) * Math.sin(phiArm),
    distanceArm * Math.cos(thetaArm)
  );

  thetaArm = normArm * Math.PI + thetaVariationArm + 5;

  armTwo = new THREE.Vector3(
    distanceArm * Math.sin(thetaArm) * Math.cos(phiArm),
    distanceArm * Math.sin(thetaArm) * Math.sin(phiArm),
    distanceArm * Math.cos(thetaArm)
  );

  thetaArm = normArm * Math.PI + thetaVariationArm + 500;

  armThree = new THREE.Vector3(
    distanceArm * Math.sin(thetaArm) * Math.cos(phiArm),
    distanceArm * Math.sin(thetaArm) * Math.sin(phiArm),
    distanceArm * Math.cos(thetaArm)
  );

  thetaArm = normArm * Math.PI + thetaVariationArm + 4500;

  armFour = new THREE.Vector3(
    distanceArm * Math.sin(thetaArm) * Math.cos(phiArm),
    distanceArm * Math.sin(thetaArm) * Math.sin(phiArm),
    distanceArm * Math.cos(thetaArm)
  );

  thetaArm = normArm * Math.PI + thetaVariationArm + 44500;

  armFive = new THREE.Vector3(
    distanceArm * Math.sin(thetaArm) * Math.cos(phiArm),
    distanceArm * Math.sin(thetaArm) * Math.sin(phiArm),
    distanceArm * Math.cos(thetaArm)
  );

  galaxyArmPoints.push(armOne, armTwo, armThree, armFour, armFive);
}

galaxyArmGeometry = new THREE.BufferGeometry().setFromPoints(galaxyArmPoints);

const spiralArmGalaxy = new THREE.Points(
  galaxyArmGeometry,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.5,
  })
);

spiralArmGalaxy.rotation.x = 2.6;
// scene.add(spiralArmGalaxy);

// Central Galaxy

const galaxyPoints = [];
const galaxySize = 400;

for (let i = 0; i < 3000; i++) {
  var theta = THREE.Math.randFloatSpread(360);
  var phi = THREE.Math.randFloatSpread(360);
  const distance = THREE.Math.randFloatSpread(galaxySize);

  galaxyPoints.push(
    new THREE.Vector3(
      distance * Math.sin(theta) * Math.cos(phi),
      distance * Math.sin(theta) * Math.sin(phi),
      (distance * Math.cos(theta)) / 10
    )
  );
}

let galaxyGeometry = new THREE.BufferGeometry().setFromPoints(galaxyPoints);

const spiralGalaxy = new THREE.Points(
  galaxyGeometry,
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 })
);

spiralGalaxy.rotation.x = 1;
// scene.add(spiralGalaxy);

// Space Stations

const geometrySS = new THREE.SphereGeometry(8, 10, 10);
const materialSSGames = new THREE.MeshPhongMaterial({ color: 0xfff000 });
const materialSSWeb = new THREE.MeshPhongMaterial({ color: 0xfff0f0 });
const materialSSDesign = new THREE.MeshPhongMaterial({ color: 0x00f0ff });
const materialSSBook = new THREE.MeshPhongMaterial({ color: 0x00f00f });

const spaceSphereList = [];
const spaceSphereGames = new THREE.Mesh(geometrySS, materialSSGames);
const spaceSphereWeb = new THREE.Mesh(geometrySS, materialSSWeb);
const spaceSphereDesign = new THREE.Mesh(geometrySS, materialSSDesign);
const spaceSphereBook = new THREE.Mesh(geometrySS, materialSSBook);
spaceSphereGames.name = "GAMES System";
spaceSphereWeb.name = "WEB System";
spaceSphereDesign.name = "DESIGN System";
spaceSphereBook.name = "BOOK System";
spaceSphereList.push(
  spaceSphereGames,
  spaceSphereWeb,
  spaceSphereDesign,
  spaceSphereBook
);

// Set up pivote for space spheres
// const pivot = new THREE.Group();
const pivotGames = new THREE.Group();
const pivotWeb = new THREE.Group();
const pivotDesign = new THREE.Group();
const pivotBook = new THREE.Group();
pivotGames.add(spaceSphereGames);
pivotWeb.add(spaceSphereWeb);
pivotDesign.add(spaceSphereDesign);
pivotBook.add(spaceSphereBook);

for (let i = 0; i < spaceSphereList.length; i++) {
  // Set up each space sphere pivot point
  spaceSphereList[i].position.set(
    Math.random() * (200 - 10) + 10,
    0,
    Math.random() * (50 - 1) + 1
  );
}
pivotGames.rotation.x = 5.9;
pivotGames.rotation.y = 0.1;
pivotWeb.rotation.x = 5.7;
pivotWeb.rotation.y = -1;
pivotDesign.rotation.x = 5.9;
pivotDesign.rotation.y = 1.5;
pivotBook.rotation.x = 5.9;
pivotBook.rotation.y = 3;

// Add all galaxy components to a group for organization
const galaxyGroup = new THREE.Group();
galaxyGroup.add(
  spiralGalaxy,
  spiralArmGalaxy,
  pivotGames,
  pivotWeb,
  pivotDesign,
  pivotBook
);
scene.add(galaxyGroup);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

// Cloud lighting
let directionalLight = new THREE.DirectionalLight(0xff8c19, 0.1);
directionalLight.position.set(0, 0, 1);

let orangeLight = new THREE.PointLight(0xcc6600, 50, 450, 1.7);
orangeLight.position.set(200, 400, 100);
let redLight = new THREE.PointLight(0xd8547e, 50, 450, 1.7);
redLight.position.set(100, 400, 100);
let blueLight = new THREE.PointLight(0x3677ac, 50, 450, 1.7);
blueLight.position.set(300, 200, 200);

scene.add(pointLight, directionalLight, orangeLight, redLight, blueLight);

/**
 * Window Sizing
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
  1,
  1000
);
camera.position.x = 0;
camera.position.y = 250;
camera.position.z = 160;
camera.rotation.x = -0.9;
scene.add(camera);

// Raycaster Initialization
// Space Stations
const raycaster = new THREE.Raycaster();
const raycasterCheck = [];

for (let i = 0; i < spaceSphereList.length; i++) {
  raycasterCheck.push(spaceSphereList[i]);
}
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", onMouseMove, false);

// Dragging galaxy functionality
let isDragging = false;
let lastSpinVelocity = 0;

const toRadians = (degrees) => {
  const pi = Math.PI;
  return degrees * (pi / 180);
};

let deltaMove = {};
let previousMousePosition = {
  x: 0,
  y: 0,
};
window.addEventListener("mousedown", function (e) {
  isDragging = true;
});
window.addEventListener("mousemove", function (e) {
  deltaMove = {
    x: e.pageX - previousMousePosition.x,
    y: e.pageY - previousMousePosition.y,
  };

  if (isDragging) {
    lastSpinVelocity = 0.001 * deltaMove.x > 0.1 ? 0.1 : 0.001 * deltaMove.x;
    spiralGalaxy.rotation.z -= 0.001 * deltaMove.x;
    spiralArmGalaxy.rotation.y -= 0.001 * deltaMove.x;
    pivotGames.rotation.y += 0.001 * deltaMove.x;
    pivotWeb.rotation.y += 0.001 * deltaMove.x;
    pivotDesign.rotation.y += 0.001 * deltaMove.x;
    pivotBook.rotation.y += 0.001 * deltaMove.x;
  }

  previousMousePosition = {
    x: e.pageX,
    y: e.pageY,
  };
});

window.addEventListener("mouseup", function (e) {
  let spinDuration = Math.abs(lastSpinVelocity * 50000);
  if (spinDuration > 8000) spinDuration = 8000;

  const setGalaxyInterval = setInterval(() => {
    if (lastSpinVelocity > 0) {
      lastSpinVelocity -= lastSpinVelocity / 5;
      // console.log(lastSpinVelocity, "spin duration = ", spinDuration);
      // lastSpinVelocity -= 0.0003;
    } else {
      lastSpinVelocity += 0.0006;
      // console.log(lastSpinVelocity, "spin duration = ", spinDuration);
    }
    spiralGalaxy.rotation.z -= lastSpinVelocity;
    spiralArmGalaxy.rotation.y -= lastSpinVelocity;
    pivotGames.rotation.y += lastSpinVelocity;
    pivotWeb.rotation.y += lastSpinVelocity;
    pivotDesign.rotation.y += lastSpinVelocity;
    pivotBook.rotation.y += lastSpinVelocity;
  }, 10);

  setTimeout(() => {
    clearInterval(setGalaxyInterval);
  }, spinDuration);

  isDragging = false;
});

function onMouseMove(e) {
  let rect = renderer.domElement.getBoundingClientRect();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// sets bg color of three js scene
renderer.setClearColor(0x000000, 0.7);

// Cloud geometry, materials and scene addition set-up
const geometryP = new THREE.PlaneGeometry(100, 100);
const textureCloud = new THREE.TextureLoader().load("cloud.png");
const materialP = new THREE.MeshLambertMaterial({
  transparent: true,
  map: textureCloud,
  side: THREE.DoubleSide,
});

let cloudParticles = [];

for (let p = 0; p < 50; p++) {
  let cloud = new THREE.Mesh(geometryP, materialP);
  // changing this to plane make sthe color much darker (whites brighter)
  cloud.position.set(
    Math.random() * 200 - 100,
    Math.random() * 50,
    Math.random() * 500 - 350
  );
  cloud.rotation.z = Math.random() * 2 * Math.PI;
  cloud.rotation.x = -0.9;
  cloud.material.opacity = 0.55;
  cloudParticles.push(cloud);
  scene.add(cloud);
}

// // Postprocessing

const composer = new EffectComposer(renderer);

// post processing steps - adding passes
const renderPass = new RenderPass(scene, camera);
renderPass.renderToScreen = true;

composer.addPass(renderPass);

// add specific post processing methods here

// const bloomPass = new BloomPass(1, 25, 4, 720);

const effectCopy = new ShaderPass(CopyShader);
// composer.addPass(bloomPass);
composer.addPass(effectCopy);

/**
 * Animate
 */

let oldIntersects = null;
let planetHovered = false;
let everHovered = false;
let intersects = [];
const planetButton = document.querySelector(".planet-button");

function render() {
  // Galaxy spin functionality
  window.addEventListener("mouseup", function (e) {
    isDragging = false;
  });

  // HTML DOM Tags: Links to portfolio pages
  const elem = document.querySelector(".planet");

  cloudParticles.forEach((p) => {
    p.rotation.z -= 0.001;
  });

  // Galaxy spheres clicking functionality
  raycaster.setFromCamera(mouse, camera);

  // Only raycast on space sphere objects
  intersects = raycaster.intersectObjects(raycasterCheck);

  // If mouse is over a space sphere object...
  if (intersects.length > 0) {
    for (let i = 0; i < intersects.length; i++) {
      intersects[0].object.scale.set(1.1, 1.1, 1.1);
      intersects[0].object.material.color.set(0x00ff00);
    }
    oldIntersects = intersects[0];
    // Slow down the spin of the galaxy
    spiralGalaxy.rotation.z -= 0.00034;
    spiralArmGalaxy.rotation.y -= 0.00024;
    pivotGames.rotation.y += 0.00024;
    pivotWeb.rotation.y += 0.00024;
    pivotDesign.rotation.y += 0.00024;
    pivotBook.rotation.y += 0.00024;

    // Display planet detection
    if (planetHovered && timeOutComplete) {
      planetRemover();
      planetHovered = false;
    } else {
      planetDetector(intersects[0]);
    }
    elem.style.opacity = "100%";
    intersects = [];

    // Display pointer on space sphere when hovering
    document.body.classList.add("spacestation-hover");

    // If mouse is NOT over a space sphere object...
  } else {
    // If user just hovered over planet previously
    if (oldIntersects !== null) {
      oldIntersects.object.scale.set(1, 1, 1);
      switch (oldIntersects.object.name) {
        case "GAMES System":
          oldIntersects.object.material.color.set(0xfff000);
          break;
        case "WEB System":
          oldIntersects.object.material.color.set(0xfff0f0);
          break;
        case "DESIGN System":
          oldIntersects.object.material.color.set(0x00f0ff);
          break;
      }
      oldIntersects = null;
      planetHovered = true;
      everHovered = true;
    }

    if (!everHovered) {
      elem.style.opacity = "0%";
    }
    document.body.classList.remove("spacestation-hover");
  }

  // Spiral Galaxy rotation
  spiralGalaxy.rotation.z += 0.0004;
  spiralArmGalaxy.rotation.y += 0.0003;
  pivotGames.rotation.y -= 0.0003;
  pivotWeb.rotation.y -= 0.00024;
  pivotDesign.rotation.y -= 0.00024;
  pivotBook.rotation.y -= 0.00024;
}

// Planet Detected Functionality
let executed = false;
let timeOutComplete = false;

let planetImage = document.querySelector(".planet-image");

function planetRemover() {
  document.querySelector(".planet-title").innerHTML = "";
  document.querySelector(".location").innerHTML = "Approaching:";
  document.querySelector(".coords").innerHTML = "Coordinates:";
  document.querySelector(".features").innerHTML = "Features:";
  document.querySelector(".planet-button").style.opacity = "0%";
  planetButton.style.opacity = "0%";
  planetButton.classList.remove("button-flash");
  executed = false;
  timeOutComplete = false;
}

// Adds innerHTML to 'Planet Detected' element in HTML
const planetDetector = function (planetName) {
  const planetDescriptionChooser = () => {
    switch (planetName.object.name) {
      case "GAMES System":
        return "Pixel Art, Production, Writing";
      case "WEB System":
        return "Web Development & Design";
      case "DESIGN System":
        return "Graphic Design";
      case "BOOK System":
        return "Published Book on Game Development";
    }
  };
  if (!executed) {
    executed = true;
    document.querySelector(".planet").classList.add("increase-zindex");
    VANILLA.typePhrase("Planet Detected", ".planet-title");
    document.querySelector(".location").append(planetName.object.name);
    document
      .querySelector(".coords")
      .append(
        `\nX: ${planetName.point.x}\nY: ${planetName.point.y}\nZ: ${planetName.point.z}`
      );
    document.querySelector(".features").append(planetDescriptionChooser());
    document.querySelector(".planet-image").style.opacity = "100%";
    setTimeout(() => {
      planetButton.style.opacity = "100%";
      planetButton.classList.add("button-flash");
    }, 1500);
    setTimeout(() => {
      timeOutComplete = true;
    }, 1500);
  }
};

// On scroll events

const animateGalaxyScroll = () => {
  spiralGalaxy.rotation.z += 0.002;
  spiralArmGalaxy.rotation.y += 0.0015;
  pivotGames.rotation.y -= 0.002;
  pivotWeb.rotation.y -= 0.002;
  pivotDesign.rotation.y -= 0.002;
  pivotBook.rotation.y -= 0.002;
};

window.addEventListener("scroll", animateGalaxyScroll);
// TESTING: shows GPU usage
stats = createStats();
stats.showPanel(0);
document.body.appendChild(stats.domElement);

const tick = () => {
  stats.update();

  render();
  // Render

  // change to renderer.render(scene,camera) when removing postprocessing (uses webgl instead of postprocessing.js)
  composer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// OLD STUFF BELOW
// OLD STUFF BELOW
// OLD STUFF BELOW
// OLD STUFF BELOW
// OLD STUFF BELOW
// OLD STUFF BELOW
// OLD STUFF BELOW
// OLD STUFF BELOW

// Debug
// const gui = new dat.GUI();
// const galaxyArmFolder = gui.addFolder("Galaxy");
// galaxyArmFolder.add(pivot.rotation, "x", 0, Math.PI * 4);
// galaxyArmFolder.add(spiralArmGalaxy.rotation, "y", 0, Math.PI * 2);
// galaxyArmFolder.add(spiralArmGalaxy.rotation, "z", 0, Math.PI * 2);
// galaxyArmFolder.open();

// OLD STUFF

// // Objects
// const torusGeometry = new THREE.TorusGeometry(150, 20, 10, 150);

// const particlesGeometry = new THREE.BufferGeometry();
// // sets how many particles are in the scene
// const particlesCount = 5000;

// const posArray = new Float32Array(particlesCount * 3);
// // xyz, xyz, xyz, xyz

// for (let i = 0; i < particlesCount * 3; i++) {
//   // Not centered:
//   // posArray[i] = Math.random();

//   // To center:
//   // posArray[i] = Math.random() - 0.5;

//   // To enlarge to take up the whole canvas:
//   posArray[i] = (Math.random() - 0.5) * 5;
// }

// particlesGeometry.setAttribute(
//   "position",
//   new THREE.BufferAttribute(posArray, 3)
// );

// Takes pos array from for loop, takes each math.random() value and sets the particle geometry value to all 5000 particles

// Materials

// const material = new THREE.PointsMaterial({
//   transparent: true,
//   size: Math.random(),
// });

// material.color = new THREE.Color(0xff0000);

// Particles Material
// const particlesMaterial = new THREE.PointsMaterial({
//   size: 0.035,
//   map: star,
//   transparent: true,
//   color: "green",
//   blending: THREE.AdditiveBlending,
// });

// Mesh
// const sphere = new THREE.Points(torusGeometry, material);
// sphere.rotation.x = 1;
// sphere.rotation.z = 1;
// // sphere.rotation.y = 1;
// // scene.add(sphere);
// scene.add(light);

// Particle system mesh
// const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
// scene.add(sphere, particlesMesh);

// Portfolio points of interest
// Space stations
// distanceArm -= 150;
// spaceStationOne = new THREE.Vector3(
//   distanceArm * Math.sin(thetaArm) * Math.cos(phiArm),
//   distanceArm * Math.sin(thetaArm) * Math.sin(phiArm),
//   distanceArm * Math.cos(thetaArm)
// );

// spaceStationPoints.push(spaceStationOne);

// spaceStationGeometry = new THREE.BufferGeometry().setFromPoints(
//   spaceStationPoints
// );

// const spaceStation = new THREE.Points(
//   spaceStationGeometry,
//   new THREE.PointsMaterial({ color: 0xffff00, size: 30 })
// );
// spaceStation.rotation.x = 2.6;
// scene.add(spaceStation);

// To create following HTML element in render()

// const elemButton = document.querySelector(".spacestation__button");
const tempVector = new THREE.Vector3();

// previous HTML based planet info card handler \/
// spaceSphereGames.updateWorldMatrix(true, false);
// spaceSphereGames.getWorldPosition(tempVector);
// tempVector.project(camera);
// const sphereX = (tempVector.x * 0.5 + 0.5) * canvas.clientWidth;
// const sphereY =
//   (tempVector.y * -0.5 + 0.38) * canvas.clientHeight +
//   100000 / (canvas.clientWidth * 1.5);

// can include a ternary here for client width/height ratio
// 1:1 would mean spherex/y can keep the above formula for calculation
// greater than 1:1 (1:2 +) would mean it should be reverted to keep the ratio
// elem.style.transform = `translate(-50%,0%) translate(${sphereX}px,${sphereY}px)`;

// Previous set time outs that caused glitching with letter input - removed and replaced with no set timeouts
// setTimeout(VANILLA.typePhrase, 2000, planetName.object.name, ".location");
// setTimeout(
//   VANILLA.typePhrase,
//   4000,
//   `\nX: ${planetName.point.x}\nY: ${planetName.point.y}\nZ: ${planetName.point.z}`,
//   ".coords"
// );
// setTimeout(
//   VANILLA.typePhrase,
//   8000,
//   planetDescriptionChooser(),
//   ".features"
// );
// setTimeout(() => {
//   planetImage.style.opacity = "100%";
// }, 10000);

// Fog effect
// change bg of fog here
// scene.fog = new THREE.FogExp2(0x02021e, 0.002);
// renderer.setClearColor(scene.fog.color);
// document.body.appendChild(renderer.domElement);
