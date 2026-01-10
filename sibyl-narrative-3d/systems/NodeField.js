import * as THREE from 'three'

export class NodeField {
  constructor(scene) {
    this.group = new THREE.Group()
    scene.add(this.group)

    const geo = new THREE.SphereGeometry(2, 8, 8)
    const mat = new THREE.MeshBasicMaterial({ color: 0x3cffb1 })

    this.nodes = []

    for (let i = 0; i < 400; i++) {
      const m = new THREE.Mesh(geo, mat)
      m.position.set(
        THREE.MathUtils.randFloatSpread(240),
        THREE.MathUtils.randFloatSpread(160),
        THREE.MathUtils.randFloatSpread(240)
      )
      this.group.add(m)
      this.nodes.push(m)
    }
  }

  /**
   * Ambil centroid berbobot dari node terdekat ke kamera
   */
  getNavigationCentroid(cameraPos, radius = 180) {
    const centroid = new THREE.Vector3()
    let totalWeight = 0

    for (const n of this.nodes) {
      const d = cameraPos.distanceTo(n.position)
      if (d < radius) {
        const w = 1 - d / radius
        centroid.add(n.position.clone().multiplyScalar(w))
        totalWeight += w
      }
    }

    if (totalWeight > 0) {
      centroid.divideScalar(totalWeight)
      return centroid
    }

    return null
  }

  update() {}
}
