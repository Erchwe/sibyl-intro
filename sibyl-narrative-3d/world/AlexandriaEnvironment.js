import * as THREE from 'three'
import gsap from 'gsap'

export class AlexandriaEnvironment {
  constructor(scene) {
    this.scene = scene
    this.group = new THREE.Group()
    
    // Grid cahaya di lantai dan langit-langit untuk kesan tak terbatas
    const gridHelper = new THREE.GridHelper(2000, 50, 0x3cffb1, 0x111111)
    gridHelper.position.y = -100
    this.group.add(gridHelper)

    // Ribuan "Kristal Memori" kecil yang melayang statis di kejauhan
    const count = 500
    const geo = new THREE.OctahedronGeometry(2, 0)
    const mat = new THREE.MeshBasicMaterial({ color: 0x3cffb1, wireframe: true, transparent: true, opacity: 0.2 })

    for (let i = 0; i < count; i++) {
      const crystal = new THREE.Mesh(geo, mat)
      crystal.position.set(
        THREE.MathUtils.randFloatSpread(1000),
        THREE.MathUtils.randFloat(0, 500),
        THREE.MathUtils.randFloatSpread(1000)
      )
      this.group.add(crystal)
    }

    this.scene.add(this.group)
    this.group.visible = false
  }

  show() {
    this.group.visible = true
    gsap.from(this.group.scale, { x: 2, y: 2, z: 2, duration: 5, ease: "power2.out" })
  }
}