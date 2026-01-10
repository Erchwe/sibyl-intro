import * as THREE from 'three'

export class StarField {
  constructor(scene) {
    const count = 1200

    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = THREE.MathUtils.randFloatSpread(2400)
      positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(2400)
      positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(2400)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    )

    const material = new THREE.PointsMaterial({
      color: 0x3cffb1,
      size: 1.1,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,           // 🔴 penting
      blending: THREE.AdditiveBlending
    })

    this.points = new THREE.Points(geometry, material)
    this.points.renderOrder = -10  // 🔴 selalu di belakang
    scene.add(this.points)
  }

  update() {
    // drift super halus
    this.points.rotation.y += 0.00004
    this.points.rotation.x += 0.00002
  }
}
