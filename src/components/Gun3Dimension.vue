<template>
  <div ref="container" id="container">
    <p>
      <span>"W" translate</span><span> "E" rotate</span>
      <span> "R" scale</span>"Shift" snap to grid
    </p>
    <p>
      <span>"X" toggle X </span><span> "Y" toggle Y</span>
      "Z" toggle Z
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue';
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

const container = ref(null);

const panel = shallowRef();
const scene = shallowRef();
const camera = shallowRef();
const renderer = shallowRef();
const orbit = shallowRef();
const gunParts = {
  all: { path: 'all' },
  Slide: {
    path: '/STL/Glock26_Slide.stl',
    posit: [5, -60, 6],
    rotate: [Math.PI, 0, 0],
    scale: [1, 1, 1],
    controler: [20, 75, -20],
  },
  SlideCatch: {
    path: '/STL/Glock26_SlideCatch.stl',
    posit: [-93, 119, -4],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
    controler: [102, -120, 0],
  },
  Barrel: {
    path: '/STL/Glock26_Barrel.stl',
    posit: [25, 127, 60],
    rotate: [0, Math.PI / 2, 0],
    scale: [1, 1, 1],
    controler: [40, -112, -75],
  },
  Body: {
    path: '/STL/Glock26_Body.stl',
    posit: [0, 50, -10],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
    controler: [-10, -35, 0],
  },
  Magazine: {
    path: '/STL/Glock26_Magazine.stl',
    posit: [-10, -105, 80],
    rotate: [Math.PI, 0, 0],
    scale: [1, 1, 1],
    controler: [0, 120, 0],
  },
  Pin: {
    path: '/STL/Glock26_Pin.stl',
    posit: [0, 158, -5],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
    controler: [60, -145, 4],
  },

  Small_Parts: {
    path: '/STL/Glock26_Small_Parts.stl',
    posit: [0, 50, -10],
    rotate: [-Math.PI / 2, 0, 0],
    scale: [1, 1, 1],
    controler: [40, 4, 100],
  },
  Bullet: {
    path: '/STL/Glock26_9mmBullet.stl',
    posit: [55, -18, -3],
    rotate: [0, Math.PI / 2, 0],
    controler: [0, 32, -13],
  },
  Shell: {
    path: '/STL/Glock26_Shell.stl',
    posit: [38, -18, -13],
    rotate: [0, Math.PI / 2, 0],
    scale: [1, 1, 1],
    controler: [10, 32, -3],
  },
};
const panelValue = shallowRef({
  positX: 150,
  positY: 150,
  positZ: 150,
  gunParts: 'all',
  ctrlShow: true,
  ctrlType: 'translate',
});

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
  camera.value.position.set(
    panelValue.value.positX,
    panelValue.value.positY,
    panelValue.value.positX
  );
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
  orbit.value = new OrbitControls(camera.value, renderer.value.domElement);
  orbit.value.target.set(0, 1, 0);
  orbit.value.update();
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
    if (child instanceof TransformControls) {
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
    const controler = obj.controler;

    mesh.position.set(posit[0], posit[1], posit[2]);
    mesh.rotation.set(rotate[0], rotate[1], rotate[2]);
    mesh.scale.set(1, 1, 1);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const control = new TransformControls(
      camera.value,
      renderer.value.domElement
    );
    control.addEventListener('change', render);
    control.addEventListener('dragging-changed', function (event) {
      orbit.value.enabled = !event.value;
    });
    control.position.set(controler[0], controler[1], controler[2]);
    control.attach(mesh);
    control.setMode(panelValue.value.ctrlType);
    scene.value.add(control);

    scene.value.add(mesh);
  });
}

function onTransformCtrl(action, param) {
  const children = scene.value.children;
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    if (child instanceof TransformControls) {
      switch (action) {
        case 'degree':
          if (param) {
            child.setTranslationSnap(100);
            child.setRotationSnap(THREE.MathUtils.degToRad(15));
            child.setScaleSnap(0.25);
          } else {
            child.setTranslationSnap(null);
            child.setRotationSnap(THREE.MathUtils.degToRad(null));
            child.setScaleSnap(null);
          }
          break;

        case 'show':
          child.showX = param;
          child.showY = param;
          child.showZ = param;
          break;

        case 'showX':
          child.showX = !child.showX;
          break;
        case 'showY':
          child.showY = !child.showY;
          break;
        case 'showZ':
          child.showZ = !child.showZ;
          break;

        case 'type':
          panelValue.value.ctrlType = param;
          child.setMode(param);
          break;

        case 'reset':
          child.reset();
          break;
      }
    }
  }
}

function createPanel() {
  const panel = new GUI({
    container: document.getElementById('container'),
    injectStyles: true,
    width: 250,
  });

  const folder1 = panel.addFolder('Camera Position');
  folder1.add(panelValue.value, 'positX', 0, 300).name('position X');
  folder1.add(panelValue.value, 'positY', 0, 300).name('position Y');
  folder1.add(panelValue.value, 'positZ', 0, 300).name('position Z');
  folder1.onChange((e) =>
    camera.value.position.set(e.object.positX, e.object.positY, e.object.positZ)
  );

  const folder2 = panel.addFolder('Gun Part');
  folder2.add(panelValue.value, 'gunParts', gunParts).name('Part');
  folder2.onChange((e) => {
    clearScene();
    if (e.value.path === 'all') {
      allPartsRender();
    } else {
      loadSTL(e.value);
    }
  });

  const folder3 = panel.addFolder('Control Mode');
  folder3
    .add(panelValue.value, 'ctrlShow')
    .name('표시')
    .onChange((e) => onTransformCtrl('show', e));
  folder3
    .add(panelValue.value, 'ctrlType', ['translate', 'rotate', 'scale'])
    .name('타입')
    .onChange((e) => onTransformCtrl('type', e));

  return panel;
}

function animate() {
  requestAnimationFrame(animate);
  orbit.value.update();
  render();
}

function render() {
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
  render();
  animate();
  panel.value = createPanel();
  allPartsRender();
});

function updateGuiCtrlType() {
  const guiCtrlType = panel.value.children[2].children[1];
  if (guiCtrlType) {
    guiCtrlType.setValue(panelValue.value.ctrlType);
  }
}

window.addEventListener('keydown', function (event) {
  switch (event.keyCode) {
    case 16: // Shift
      onTransformCtrl('degree', true);
      break;

    case 87: // W
      onTransformCtrl('type', 'translate');
      updateGuiCtrlType();
      break;

    case 69: // E
      onTransformCtrl('type', 'rotate');
      updateGuiCtrlType();
      break;

    case 82: // R
      onTransformCtrl('type', 'scale');
      updateGuiCtrlType();
      break;

    case 88: // X
      onTransformCtrl('showX');
      break;

    case 89: // Y
      onTransformCtrl('showY');
      break;

    case 90: // Z
      onTransformCtrl('showZ');
      break;

    case 27: // Esc
      onTransformCtrl('reset');
      break;
  }
});
window.addEventListener('keyup', function (event) {
  switch (event.keyCode) {
    case 16: // Shift
      onTransformCtrl('degree', false);
      break;
  }
});
</script>

<style scoped>
#container {
  margin: 30px auto 0;
  position: relative;
  width: 90%;
  height: 80%;
  min-height: 600px;
  border: 1px solid black;
}
#container p {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  text-align: center;
}

#container p + p {
  margin-top: 20px;
}
#container p span::after {
  margin-left: 10px;
  margin-right: 10px;
  content: '|';
}
</style>
<style>
.lil-gui.root {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
