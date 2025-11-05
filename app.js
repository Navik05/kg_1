import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Сцена
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87CEEB)

// Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.physicallyCorrectLights = true
document.body.appendChild(renderer.domElement)

// Камера
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(12, 8, 5)

// Управление камерой
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05

// Загрузчик моделей
const loader = new GLTFLoader()

// Рассеянный свет
const ambientLight = new THREE.AmbientLight(0x404040, 6)
scene.add(ambientLight)

// Направленный свет
const directionalLight = new THREE.DirectionalLight(0xfff4e6, 1.2)
directionalLight.position.set(15, 20, 10)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 50
directionalLight.shadow.camera.left = -20
directionalLight.shadow.camera.right = 20
directionalLight.shadow.camera.top = 20
directionalLight.shadow.camera.bottom = -20
scene.add(directionalLight)

// Точечные источники света на потолке
const ceilingLight1 = new THREE.PointLight(0xffffff, 20, 15)
ceilingLight1.position.set(-8, 8, -8)
ceilingLight1.castShadow = true
scene.add(ceilingLight1)

const ceilingLight2 = new THREE.PointLight(0xffffff, 20, 15)
ceilingLight2.position.set(8, 8, -8)
ceilingLight2.castShadow = true
scene.add(ceilingLight2)

const ceilingLight3 = new THREE.PointLight(0xffffff, 20, 15)
ceilingLight3.position.set(-8, 8, 8)
ceilingLight3.castShadow = true
scene.add(ceilingLight3)

const ceilingLight4 = new THREE.PointLight(0xffffff, 20, 15)
ceilingLight4.position.set(8, 8, 8)
ceilingLight4.castShadow = true
scene.add(ceilingLight4)

// Пол
const floorGeometry = new THREE.PlaneGeometry(40, 40)
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x7a7a7a,
    roughness: 0.9,
    metalness: 0.1
})
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

// Разметка на полу
const floorMarkings = new THREE.Group()
const markingGeometry = new THREE.PlaneGeometry(0.2, 3)
const markingMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })

for (let i = -15; i <= 15; i += 5) {
    const marking = new THREE.Mesh(markingGeometry, markingMaterial)
    marking.rotation.x = -Math.PI / 2
    marking.position.set(i, 0.01, 0)
    floorMarkings.add(marking)

    const marking1 = new THREE.Mesh(markingGeometry, markingMaterial)
    marking1.rotation.x = -Math.PI / 2
    marking1.position.set(0, 0.01, i)
    floorMarkings.add(marking1)
}
scene.add(floorMarkings)

// Загружаем кирпичную текстуру
const textureLoader = new THREE.TextureLoader();
const brickTexture = textureLoader.load('https://threejs.org/examples/textures/brick_diffuse.jpg');

// Повторение текстуры кирпича
brickTexture.wrapS = THREE.RepeatWrapping;
brickTexture.wrapT = THREE.RepeatWrapping;
brickTexture.repeat.set(8, 2);

// Материал стены с текстурой
const wallMaterial = new THREE.MeshStandardMaterial({ 
    map: brickTexture,
    roughness: 0.8,
    metalness: 0.05
});

// Стены
const wallGeometry = new THREE.BoxGeometry(40, 10, 0.5)

const backWall = new THREE.Mesh(wallGeometry, wallMaterial)
backWall.position.set(0, 5, -20)
backWall.receiveShadow = true
scene.add(backWall)

const frontWall = new THREE.Mesh(wallGeometry, wallMaterial)
frontWall.position.set(0, 5, 20)
frontWall.receiveShadow = true
scene.add(frontWall)

const leftWall = new THREE.Mesh(wallGeometry, wallMaterial)
leftWall.position.set(-20, 5, 0)
leftWall.rotation.y = Math.PI / 2
leftWall.receiveShadow = true
scene.add(leftWall)

const rightWall = new THREE.Mesh(wallGeometry, wallMaterial)
rightWall.position.set(20, 5, 0)
rightWall.rotation.y = Math.PI / 2
rightWall.receiveShadow = true
scene.add(rightWall)

// Потолок
const ceilingGeometry = new THREE.BoxGeometry(40, 0.2, 40)
const ceilingMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xf0f0f0,
    roughness: 0.7,
    metalness: 0.1
})
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial)
ceiling.position.set(0, 10, 0)
scene.add(ceiling)

// Светильники на потолке
function createCeilingLight(x, z) {
    const lightGroup = new THREE.Group()
    
    const lightFixtureGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32)
    const lightFixtureMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffcc,
        emissiveIntensity: 0.3
    })
    const lightFixture = new THREE.Mesh(lightFixtureGeometry, lightFixtureMaterial)
    lightFixture.position.y = -0.15
    lightGroup.add(lightFixture)
    
    lightGroup.position.set(x, 9.9, z)
    return lightGroup
}

scene.add(createCeilingLight(-8, -8))
scene.add(createCeilingLight(8, -8))
scene.add(createCeilingLight(-8, 8))
scene.add(createCeilingLight(8, 8))

// Подъемник
function createLift() {
    const lift = new THREE.Group()
    
    const metalMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x666666,
        roughness: 0.3,
        metalness: 0.9
    })
    
    // Основание
    const baseGeometry = new THREE.BoxGeometry(10, 0.5, 6)
    const base = new THREE.Mesh(baseGeometry, metalMaterial)
    base.position.y = 0.25
    base.castShadow = true
    base.receiveShadow = true
    lift.add(base)
    
    // Стойки
    const postGeometry = new THREE.BoxGeometry(0.5, 4, 0.3)
    const postPositions = [
        [-1.2, 2, -2.5],
        [1.2, 2, -2.5],
        [-1.2, 2, 2.5],
        [1.2, 2, 2.5]
    ]
    
    postPositions.forEach(pos => {
        const post = new THREE.Mesh(postGeometry, metalMaterial)
        post.position.set(...pos)
        post.castShadow = true
        lift.add(post)
    })

    lift.position.set(10,0,10)
    return lift
}

const lift = createLift()
scene.add(lift)

// Верстак с инструментами
const workbenchGeometry = new THREE.BoxGeometry(3, 2, 1)
const workbenchMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513,
    roughness: 0.8,
    metalness: 0.1
})
const workbench = new THREE.Mesh(workbenchGeometry, workbenchMaterial)
workbench.position.set(-10, 1, -5)
workbench.castShadow = true
workbench.receiveShadow = true
scene.add(workbench)

// Ящик с инструментами
const toolboxGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.8)
const toolboxMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFF0000,
    roughness: 0.6,
    metalness: 0.3
})
const toolbox = new THREE.Mesh(toolboxGeometry, toolboxMaterial)
toolbox.position.set(-10, 2.4, -5)
toolbox.castShadow = true
scene.add(toolbox)

// Шкаф для запчастей
const cabinetGeometry = new THREE.BoxGeometry(5, 9, 3)
const cabinetMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x7b3f0f,
    roughness: 0.7,
    metalness: 0.2
})
const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial)
cabinet.position.set(15, 4, -18)
cabinet.castShadow = true
cabinet.receiveShadow = true
scene.add(cabinet)

// Запасные колеса рядом со шкафом
const wheelGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.6, 16)
wheelGeometry.rotateZ(Math.PI / 2)
const wheelMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x222222,
    roughness: 0.9,
    metalness: 0.1
})

// Создаем несколько колес
const wheelPositions = [
    [19, 1.1, -10],
    [19, 1.1, -7],
    [19, 1.1, -2],
    [19, 1.1, 1],
]

wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel.position.set(...pos)
    wheel.castShadow = true
    scene.add(wheel)
})

// Ниссан
loader.load(
    './models/nissan-skyline-r34-gtr-2002-wwwvecarzcom/source/2002_nissan_skyline_r34_gt-r.glb',
    function (gltf) {
        const car = gltf.scene
        car.position.set(-10, 0, -10)
        car.scale.set(250, 250, 250)
        car.rotation.y = Math.PI / 2
        
        car.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        scene.add(car)
    }
)

// Додж
loader.load(
    './models/2020-dodge-challenger-srt-super-stock/source/2020_dodge_challenger_srt_super_stock.glb',
    function (gltf) {
        const car = gltf.scene
        car.position.set(-10, 0, 10)
        car.scale.set(250, 250, 250)
        car.rotation.y = Math.PI / 2
        
        car.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        scene.add(car)
    }
)

// Автомеханик
loader.load(
    './models/car_mechanic.glb',
    function (gltf) {
        const car = gltf.scene
        car.position.set(13, 0, -7)
        car.scale.set(3, 3, 3)
        car.rotation.y = Math.PI / 2
        
        car.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        scene.add(car)
    }
)

// Анимация
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}

// Запуск анимации
animate()