import * as THREE from 'three'

export class StarField {
  constructor(scene) {
    const count = 1200
    this.depth = 1200

    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = THREE.MathUtils.randFloatSpread(2400)
      positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(2400)
      positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(this.depth)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    )

    this.material = new THREE.PointsMaterial({
      color: 0x3cffb1,
      size: 1.1,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    this.points = new THREE.Points(geometry, this.material)
    this.points.renderOrder = -10
    scene.add(this.points)

    /* ===== NEW ===== */
    this.dimmed = false
  }

  enterDim() {
    this.dimmed = true
  }

  update() {
    // orbit halus tetap ada
    this.points.rotation.y += 0.00004
    this.points.rotation.x += 0.00002

    // 🌒 pelan-pelan redup
    if (this.dimmed) {
      this.material.opacity += (0.08 - this.material.opacity) * 0.03
      this.material.size += (0.6 - this.material.size) * 0.03
    }
  }
}
