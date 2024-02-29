<template><div ref="container" id="container"></div></template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue';
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

const container = ref(null);

const scene = shallowRef();
const camera = shallowRef();
const renderer = shallowRef();
const position = { x: 150, y: 150, z: 150 };
const gunParts = {
  all: { path: 'all' },
  Slide: {
    path: '/STL/Glock26_Slide.stl',
    posit: [5, -60, 6],
    rotate: [Math.PI, 0, 0],
    scale: [1, 1, 1],
  },
  SlideCatch: {
    path: '/STL/Glock26_SlideCatch.stl',
    posit: [-93, 119, -4],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
  },
  Barrel: {
    path: '/STL/Glock26_Barrel.stl',
    posit: [25, 127, 60],
    rotate: [0, Math.PI / 2, 0],
    scale: [1, 1, 1],
  },
  Body: {
    path: '/STL/Glock26_Body.stl',
    posit: [0, 50, -10],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
  },
  Magazine: {
    path: '/STL/Glock26_Magazine.stl',
    posit: [-10, -105, 80],
    rotate: [Math.PI, 0, 0],
    scale: [1, 1, 1],
  },
  Pin: {
    path: '/STL/Glock26_Pin.stl',
    posit: [0, 158, -5],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
  },

  Small_Parts: {
    path: '/STL/Glock26_Small_Parts.stl',
    posit: [0, 50, -10],
    rotate: [-Math.PI / 2, 0, 0],
    scale: [1, 1, 1],
  },
  Bullet: {
    path: '/STL/Glock26_9mmBullet.stl',
    posit: [55, -18, -3],
    rotate: [0, Math.PI / 2, 0],
  },
  Shell: {
    path: '/STL/Glock26_Shell.stl',
    posit: [38, -18, -13],
    rotate: [0, Math.PI / 2, 0],
    scale: [1, 1, 1],
  },
};

function init() {
  scene.value = new THREE.Scene();
  camera.value = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer.value = new THREE.WebGLRenderer();

  renderer.value.setSize(
    container.value.clientWidth,
    container.value.clientHeight
  );
  camera.value.position.set(position.x, position.y, position.z);
  container.value.appendChild(renderer.value.domElement);

  // 바닥
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
  hemiLight.position.set(-20, 20, -90);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(0, 20, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.top = 2;
  directionalLight.shadow.camera.bottom = -2;
  directionalLight.shadow.camera.left = -2;
  directionalLight.shadow.camera.right = 2;

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(250, 250),
    new THREE.MeshPhongMaterial({ color: 0xbbbbbb, depthWrite: false })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  const grid = new THREE.GridHelper(250, 30, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;

  scene.value.add(hemiLight);
  scene.value.add(directionalLight);
  scene.value.add(ground);
  scene.value.add(grid);
  scene.value.background = new THREE.Color(0xa0a0a0);

  /* 마우스 화면 컨트롤 */
  const orbit = new OrbitControls(camera.value, renderer.value.domElement);
  orbit.target.set(0, 1, 0);
  orbit.update();
}

function clearScene() {
  const children = scene.value.children;
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    if (child instanceof THREE.Mesh && i !== 2) {
      child.geometry.dispose();
      child.material.dispose();
      scene.value.remove(child);
    }
  }
}
function allPartsRender() {
  Object.keys(gunParts).map((e, i) => (i === 0 ? '' : loadSTL(gunParts[e])));
}

function loadSTL(obj) {
  const loader = new STLLoader();
  const material = new THREE.MeshPhongMaterial({
    color: 0x444444,
    specular: 0x494949,
    shininess: 600,
  });

  loader.load(obj.path, function (geometry) {
    let meshMaterial = material;

    if (geometry.hasColors) {
      meshMaterial = new THREE.MeshPhongMaterial({
        opacity: geometry.alpha,
        vertexColors: true,
      });
    }

    const mesh = new THREE.Mesh(geometry, meshMaterial);
    const posit = obj.posit;
    const rotate = obj.rotate;

    mesh.position.set(posit[0], posit[1], posit[2]);
    mesh.rotation.set(rotate[0], rotate[1], rotate[2]);
    mesh.scale.set(1, 1, 1);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.value.add(mesh);
  });
}

function createPanel() {
  const panel = new GUI({
    container: document.getElementById('container'),
    injectStyles: true,
    width: 250,
  });

  const folder1 = panel.addFolder('Camera Position');
  folder1.add(position, 'x');
  folder1.add(position, 'y');
  folder1.add(position, 'z');
  folder1.onChange((e) =>
    camera.value.position.set(e.object.x, e.object.y, e.object.z)
  );

  const folder2 = panel.addFolder('Gun Part');
  const obj = { part: 'all' };
  folder2.add(obj, 'part', gunParts);
  folder2.onChange((e) => {
    clearScene();
    if (e.value.path === 'all') {
      allPartsRender();
    } else {
      loadSTL(e.value);
    }
  });

  const folder3 = panel.addFolder('General Speed');

  const panelSettings = {
    'modify time scale': 1.0,
  };
}

function animate() {
  requestAnimationFrame(animate);
  renderer.value.render(scene.value, camera.value);
}

window.addEventListener('resize', onWindowResize);
function onWindowResize() {
  camera.value.aspect = window.innerWidth / window.innerHeight;
  camera.value.updateProjectionMatrix();

  renderer.value.setSize(
    container.value.clientWidth,
    container.value.clientHeight
  );
}

onMounted(() => {
  init();
  animate();
  createPanel();
  allPartsRender();
});
</script>

<style scoped>
#container {
  margin: 0 auto;
  position: relative;
  width: 90%;
  height: 80%;
  min-height: 600px;
  border: 1px solid black;
}
</style>
<style>
.lil-gui.root {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
