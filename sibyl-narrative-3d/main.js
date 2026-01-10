import * as THREE from 'three'
import { SceneManager } from './core/SceneManager.js'

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x0b0b0b)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
)

// ⚠️ JANGAN set position di sini.
// CameraRig adalah satu-satunya pengontrol kamera.

const manager = new SceneManager(scene, camera)

function animate() {
  requestAnimationFrame(animate)
  manager.update()
  renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
