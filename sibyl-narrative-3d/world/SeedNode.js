import * as THREE from 'three'
import gsap from 'gsap'


export class SeedNode {
  constructor(scene) {
    const geo = new THREE.SphereGeometry(4, 32, 32)
    this.material = new THREE.MeshBasicMaterial({
      color: 0x3cffb1,
      transparent: true,
      opacity: 1
    })

    this.mesh = new THREE.Mesh(geo, this.material)
    scene.add(this.mesh)
    this.mesh.position.set(0, 0, 0)

    this.mode = 'idle' 
    // idle | alone | heating

    this.timer = 0
  }

  // dipanggil ketika nodecloud selesai dissolution
  enterAlone() {
    this.mode = 'alone'
    this.timer = 0
  }

  update() {
    if (this.mode === 'alone') {
      this.timer += 0.01
      return
    }

    if (this.mode === 'heating') {
      this.timer += 0.01

      const t = Math.min(1, this.timer / 2.0)

      const color = new THREE.Color()
      color.setHSL(
        THREE.MathUtils.lerp(0.38, 0.02, t),
        0.75,
        0.5
      )
      this.material.color.copy(color)
    }
  }

  isAloneComplete() {
    return this.mode === 'alone' && this.timer > 1.5
  }

  startHeating() {
    this.mode = 'heating'
    this.timer = 0
  }

  morphOut() {
  // Soft fade, tidak mengganggu fase seed-alone / heating
  if (!this.mesh) return

  this.mesh.material.transparent = true

  gsap.to(this.mesh.material, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  })
}

}
