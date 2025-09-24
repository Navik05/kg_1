import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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

// Функция создания линии
function createLine(points, color)
{
    const material = new THREE.LineBasicMaterial({color: color})
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(lineGeometry, material)
    return line
}

// Ось X
const points = []
points.push(new THREE.Vector3(-5, 0, 0))  // Начальная точка
points.push(new THREE.Vector3(5, 0, 0))   // Конечная точка
scene.add(createLine(points, 'red'))

// Ось Y
points [0] = (new THREE.Vector3(0, -5, 0))
points [1] = (new THREE.Vector3(0, 5, 0))
scene.add(createLine(points, 'green'))

// Ось Z
points [0] = (new THREE.Vector3(0, 0, -5))
points [1] = (new THREE.Vector3(0, 0, 5))
scene.add(createLine(points, 'blue'))

// Создание буквы К
const letter = new THREE.Group()
const material = new THREE.LineBasicMaterial({color: 'blue'})

const verticalGeometry = new THREE.BoxGeometry(0.5, 3, 0.5)
const vertical = new THREE.Mesh(verticalGeometry, material)
letter.add(vertical)

const topDiagonalGeometry = new THREE.BoxGeometry(0.5, 2, 0.5)
const topDiagonal = new THREE.Mesh(topDiagonalGeometry, material)
topDiagonal.position.set(1, -0.5, 0)
topDiagonal.rotation.z = Math.PI / 4
letter.add(topDiagonal)

const bottomDiagonalGeometry = new THREE.BoxGeometry(0.5, 2, 0.5)
const bottomDiagonal = new THREE.Mesh(bottomDiagonalGeometry, material)
bottomDiagonal.position.set(1, 0.6, 0)
bottomDiagonal.rotation.z = -Math.PI / 4
letter.add(bottomDiagonal)

letter.position.x = 1;

const group = new THREE.Group()
group.add(letter) 

scene.add(group)

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