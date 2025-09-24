import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {Matrix4} from './Matrix4.js'

// Сцена
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

// Камера
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(3, 3, 7)

// Рендеринг
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Взаимодействие с камерой
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.minDistance = 1.5
controls.maxDistance = 15

// Добавление осей координат
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// Создаем букву К
const letterK = createLetterI()
scene.add(letterK)


/*
const group = new THREE.Group()
group.add(letter) 

scene.add(group) */



/* // Анимация по нажатию на букву
let isAnimation = false

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

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

window.addEventListener('click', onMouseClick) */

// Бесконенечная функция рендера
function animate(){
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}
animate() 

// Создание линии
function createLine(points){
    const material = new THREE.LineBasicMaterial({color: 'black'})
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
        createLine([new THREE.Vector3(...start), new THREE.Vector3(...end)])
    ).forEach(points => letterGroup.add(points))

    return letterGroup
}