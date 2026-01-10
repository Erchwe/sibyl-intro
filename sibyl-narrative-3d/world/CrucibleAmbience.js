import * as THREE from 'three'

export class CrucibleAmbience {
  constructor(scene) {
    this.scene = scene
    this.group = new THREE.Group()
    scene.add(this.group)

    /* =========================
       HEAT FOG (VOLUME ILLUSION)
    ========================= */
    const fogGeo = new THREE.SphereGeometry(900, 32, 32)
    const fogMat = new THREE.MeshBasicMaterial({
      color: 0x22090c,
      transparent: true,
      opacity: 0.0,
      side: THREE.BackSide,
      depthWrite: false
    })

    this.fog = new THREE.Mesh(fogGeo, fogMat)
    this.group.add(this.fog)

    /* =========================
       ENERGY NOISE (PARTICLES)
    ========================= */
    const count = 600
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = THREE.MathUtils.randFloatSpread(600)
      positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(600)
      positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(600)
    }

    const noiseGeo = new THREE.BufferGeometry()
    noiseGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    )

    const noiseMat = new THREE.PointsMaterial({
      color: 0xff4422,
      size: 1.4,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    this.noise = new THREE.Points(noiseGeo, noiseMat)
    this.group.add(this.noise)

    /* =========================
       STATE
    ========================= */
    this.active = false
    this.time = 0
  }

  activate() {
    this.active = true
  }

update(corePosition) {
  if (!this.active) return

  this.time += 0.01

  // fog pressure
  this.fog.material.opacity += (0.12 - this.fog.material.opacity) * 0.03

  // noise emergence
  this.noise.material.opacity += (0.25 - this.noise.material.opacity) * 0.04

  // 🔥 NEW: SLOW INFALL TOWARD CORE
  if (corePosition) {
    const positions = this.noise.geometry.attributes.position.array

    for (let i = 0; i < positions.length; i += 3) {
      const p = new THREE.Vector3(
        positions[i],
        positions[i + 1],
        positions[i + 2]
      )

      const dir = corePosition.clone().sub(p).multiplyScalar(0.002)
      p.add(dir)

      positions[i] = p.x
      positions[i + 1] = p.y
      positions[i + 2] = p.z
    }

    this.noise.geometry.attributes.position.needsUpdate = true
  }

  this.noise.rotation.y += 0.0006
  this.noise.rotation.x += 0.0003
}

}
