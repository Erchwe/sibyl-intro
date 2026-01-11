import * as THREE from 'three'
import gsap from 'gsap'

export class ConclusionCrystal {
  constructor(scene) {
    this.scene = scene
    this.group = new THREE.Group()
    
    // Geometri tajam: Octahedron melambangkan presisi
    const geo = new THREE.OctahedronGeometry(15, 0)
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      wireframe: true
    })

    this.mesh = new THREE.Mesh(geo, mat)
    this.group.add(this.mesh)
    this.scene.add(this.group)
    
    this.light = new THREE.PointLight(0xffffff, 0, 300)
    this.group.add(this.light)
  }

  reveal() {
    gsap.to(this.mesh.material, { opacity: 1, duration: 1 })
    gsap.from(this.group.scale, { x: 0, y: 0, z: 0, duration: 2, ease: "elastic.out(1, 0.5)" })
    gsap.to(this.light, { intensity: 5, duration: 0.5, yoyo: true, repeat: 1 })
  }

  update() {
    if (this.mesh.material.opacity > 0) {
      this.mesh.rotation.y += 0.005
      this.mesh.rotation.z += 0.002
    }
  }
}