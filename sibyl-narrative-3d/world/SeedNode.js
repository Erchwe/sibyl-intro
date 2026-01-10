import * as THREE from 'three'
import gsap from 'gsap'

export class SeedNode {
  constructor(scene) {
    const geo = new THREE.SphereGeometry(6, 24, 24)
    const mat = new THREE.MeshBasicMaterial({ color: 0x3cffb1 })

    this.mesh = new THREE.Mesh(geo, mat)
    scene.add(this.mesh)

    gsap.to(this.mesh.scale, {
      x: 1.15,
      y: 1.15,
      z: 1.15,
      yoyo: true,
      repeat: -1,
      duration: 1.6,
      ease: 'sine.inOut'
    })
  }a

  morphOut() {
    gsap.to(this.mesh.scale, {
      x: 0.1,
      y: 0.1,
      z: 0.1,
      duration: 1.0,
      ease: 'power3.in'
    })
  }

  update() {}
}
