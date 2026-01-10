import * as THREE from 'three'
import gsap from 'gsap'

export class CrucibleCore {
  constructor(scene) {
    this.scene = scene
    this.group = new THREE.Group()
    scene.add(this.group)

    /* =========================
       CORE GEOMETRY
    ========================= */
    const geo = new THREE.IcosahedronGeometry(22, 1)
    const mat = new THREE.MeshStandardMaterial({
      color: 0x7a0f12,
      emissive: 0x220404,
      roughness: 0.6,
      metalness: 0.4
    })

    this.core = new THREE.Mesh(geo, mat)
    this.group.add(this.core)

    /* =========================
       INNER GLOW
    ========================= */
    const glowGeo = new THREE.SphereGeometry(16, 24, 24)
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff4422,
      transparent: true,
      opacity: 0
    })

    this.glow = new THREE.Mesh(glowGeo, glowMat)
    this.group.add(this.glow)

    /* =========================
       LIGHT
    ========================= */
    this.light = new THREE.PointLight(0xff4422, 0, 160)
    this.group.add(this.light)

    /* =========================
       INITIAL STATE
    ========================= */
    this.group.visible = true
    this.group.scale.set(0.01, 0.01, 0.01)
    this.active = false
    this.time = 0
  }

  activate() {
    if (this.active) return
    this.active = true

    // Condense into existence
    gsap.to(this.group.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2.4,
      ease: 'power3.out'
    })

    gsap.to(this.glow.material, {
      opacity: 0.25,
      duration: 2.2,
      ease: 'power2.out'
    })

    gsap.to(this.light, {
      intensity: 2.2,
      duration: 2.0,
      ease: 'power2.out'
    })
  }

  update() {
    if (!this.active) return

this.time += 0.01

// rotation feels heavier
this.core.rotation.y += 0.0006
this.core.rotation.x += 0.0003

// non-periodic pulse
const pulse = 0.6 + Math.sin(this.time * 1.3) * Math.sin(this.time * 0.7)
this.glow.material.opacity += ((0.25 * pulse) - this.glow.material.opacity) * 0.04
this.light.intensity += ((2.0 * pulse) - this.light.intensity) * 0.03

  }
}
