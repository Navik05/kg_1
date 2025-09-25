import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {Matrix4} from './Matrix4.js'

// Сцена
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

// Рендеринг
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Камера
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(3, 3, 7)

// Взаимодействие с камерой
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.minDistance = 1.5
controls.maxDistance = 15

// Создаём оси координат
const xyz = createXYZ()
scene.add(xyz)

// Создаем букву I
const letter = createLetterI()
const group = new THREE.Group()
group.add(letter) 
scene.add(group) 

// Объект для отслеживания нажатых клавиш
const keys = {
    // Перемещение
    w: false, a: false, s: false, d: false, r: false, f: false,
    // Масштабирование
    i: false, k: false, j: false, l: false, u: false, o: false,
    // Поворот
    q: false, e: false, z: false, x: false, c: false, v: false
}

// Обработчики клавиш
window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase()
    if (keys.hasOwnProperty(key)) {
        keys[key] = true
    }
})

window.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase()
    if (keys.hasOwnProperty(key)) {
        keys[key] = false
    }
})

// Анимация по нажатию на букву
let isAnimation = false
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
window.addEventListener('click', onMouseClick)

// Бесконенечная функция рендера
function animate(){
    requestAnimationFrame(animate)
    handleTransformations()
    controls.update()
    renderer.render(scene, camera)
}
animate() 

// Создание линии
function createLine(points, color){
    const material = new THREE.LineBasicMaterial({color: color})
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(lineGeometry, material)
    return line
}

// Создание буквы I из линий
function createLetterI() {
    const letterGroup = new THREE.Group()
    const points = [
    // Средняя палка
    [[0, 2, 1], [0, -2, 1]],
    [[0, -2, 0], [0, 2, 0]],
    [[1, -2, 0], [1, 2, 0]],
    [[1, -2, 1], [1, 2, 1]],
    
    // Верхняя палка
    [[-1, 2, 0], [2, 2, 0]],
    [[2, 2, 0], [2, 2, 1]],
    [[2, 2, 1], [-1, 2, 1]],
    [[-1, 2, 1], [-1, 2, 0]],
    [[-1, 2, 0], [-1, 3, 0]],
    [[-1, 3, 0], [2, 3, 0]],
    [[2, 3, 0], [2, 3, 1]],
    [[2, 3, 0], [2, 2, 0]],
    [[2, 2, 1], [2, 3, 1]],
    [[2, 3, 1], [-1, 3, 1]],
    [[-1, 3, 1], [-1, 3, 0]],
    [[-1, 3, 1], [-1, 2, 1]],
    
    // Нижняя палка
    [[-1, -2, 0], [2, -2, 0]],
    [[2, -2, 0], [2, -2, 1]],
    [[2, -2, 1], [-1, -2, 1]],
    [[-1, -2, 1], [-1, -2, 0]],
    [[-1, -2, 0], [-1, -3, 0]],
    [[-1, -3, 0], [2, -3, 0]],
    [[2, -3, 0], [2, -3, 1]],
    [[2, -3, 0], [2, -2, 0]],
    [[2, -2, 1], [2, -3, 1]],
    [[2, -3, 1], [-1, -3, 1]],
    [[-1, -3, 1], [-1, -3, 0]],
    [[-1, -3, 1], [-1, -2, 1]]
    ]

    points.map(([start, end]) => 
        createLine([new THREE.Vector3(...start), new THREE.Vector3(...end)], 'black')
    ).forEach(points => letterGroup.add(points))

    return letterGroup
}

// Добавление осей координат
function createXYZ() {
    const xyzGroup = new THREE.Group()

    // Ось X
    xyzGroup.add(createLine([new THREE.Vector3(-6, 0, 0), new THREE.Vector3(6, 0, 0)], 'red'))
    // Ось Y
    xyzGroup.add(createLine([new THREE.Vector3(0, -6, 0), new THREE.Vector3(0, 6, 0)], 'green'))
    // Ось Z
    xyzGroup.add(createLine([new THREE.Vector3(0, 0, -6), new THREE.Vector3(0, 0, 6)], 'blue'))

    return xyzGroup
}

// Функция для обработки всех преобразований
function handleTransformations() {
    const matrix = new Matrix4()

    // Начальные данные перемещения
    let dx = 0, dy = 0, dz = 0
    const step = 0.1
    
    // Начальные данные масштабирования
    let sx = 1, sy = 1, sz = 1
    const scaleStep = 1.03

    // Начальные данные поворота
    const rotationStep = 0.05 
    
    // Перемещение
    if (keys['w'] || keys['s'] || keys['a'] || keys['d'] || keys['r'] || keys['f']) {
        if (keys['w']) dy += step  // Вверх (Y+)
        if (keys['s']) dy -= step  // Вниз (Y-)
        if (keys['a']) dx -= step  // Влево (X-)
        if (keys['d']) dx += step  // Вправо (X+)
        if (keys['r']) dz += step  // Вперед (Z+)
        if (keys['f']) dz -= step  // Назад (Z-)
        
        if (dx !== 0 || dy !== 0 || dz !== 0) {
            matrix.movGroup(letter, dx, dy, dz)
        }
    }
    
    // Масштабирование
    if (keys['i'] || keys['k'] || keys['j'] || keys['l'] || keys['u'] || keys['o']) {
        if (keys['i']) sy *= scaleStep    // Увеличить по Y
        if (keys['k']) sy /= scaleStep    // Уменьшить по Y
        if (keys['j']) sx /= scaleStep    // Уменьшить по X
        if (keys['l']) sx *= scaleStep    // Увеличить по X
        if (keys['u']) sz *= scaleStep    // Увеличить по Z
        if (keys['o']) sz /= scaleStep    // Уменьшить по Z
        
        if (sx !== 1 || sy !== 1 || sz !== 1) {
            matrix.scaleGroup(letter, sx, sy, sz)
        }
    }
    
    // Поворот
    if (keys['q'] || keys['e'] || keys['z'] || keys['x'] || keys['c'] || keys['v']) {
        if (keys['q']) matrix.rotateGroupX(letter, rotationStep)   // Поворот вокруг X+
        if (keys['e']) matrix.rotateGroupX(letter, -rotationStep)  // Поворот вокруг X-
        if (keys['z']) matrix.rotateGroupY(letter, rotationStep)   // Поворот вокруг Y+
        if (keys['x']) matrix.rotateGroupY(letter, -rotationStep)  // Поворот вокруг Y-
        if (keys['c']) matrix.rotateGroupZ(letter, rotationStep)   // Поворот вокруг Z+
        if (keys['v']) matrix.rotateGroupZ(letter, -rotationStep)  // Поворот вокруг Z-
    }
}

// Анимация по заданию
function onMouseClick(event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(letter)

    if(intersects.length > 0 && !isAnimation)
    {
        isAnimation = true
        
        // Анимация вращения буквы вокруг центра координат
        gsap.to(group.rotation, {
            duration: 6,
            y: group.rotation.y + Math.PI * 2,
            ease: "power1.inOut",           
        })

        // Анимация вращения буквы вокруг своего центра 
        gsap.to(letter.rotation, {
        duration: 2,
        x: letter.rotation.x + Math.PI * 2,
        y: letter.rotation.y + Math.PI * 2,
        repeat: 2,
        ease: "power1.inOut",
        onComplete: () => { isAnimation = false }
        })
    }
}