import * as THREE from 'three'
import gsap from 'gsap'

export class AlexandriaUplink {
  constructor(scene) {
    this.scene = scene
    this.group = new THREE.Group()
    
    // Pilar Cahaya Utama (Cylinder)
    const geo = new THREE.CylinderGeometry(1.5, 1.5, 2000, 32, 1, true)
    this.mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })
    
    this.beam = new THREE.Mesh(geo, this.mat)
    this.group.add(this.beam)

    // Efek Cahaya Tambahan (Glow Lingkaran di Dasar)
    const ringGeo = new THREE.RingGeometry(0, 15, 32)
    this.ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })
    this.ring = new THREE.Mesh(ringGeo, this.ringMat)
    this.ring.rotation.x = -Math.PI / 2
    this.group.add(this.ring)

    this.scene.add(this.group)
    this.active = false
  }

  ignite() {
    this.active = true
    // Munculkan pilar menembak ke atas
    gsap.to(this.mat, { opacity: 0.7, duration: 1.5, ease: "power2.out" })
    gsap.from(this.beam.scale, { x: 0, z: 0, duration: 1, ease: "expo.out" })
    
    // Munculkan ring di dasar kristal
    gsap.to(this.ringMat, { opacity: 0.3, duration: 2 })
    gsap.from(this.ring.scale, { x: 0, y: 0, duration: 1.5, ease: "back.out(1.7)" })
  }

  update() {
    if (this.active) {
      this.beam.rotation.y += 0.04
      // Efek flickering tipis pada pilar
      this.mat.opacity = 0.6 + Math.sin(Date.now() * 0.01) * 0.1
    }
  }
}