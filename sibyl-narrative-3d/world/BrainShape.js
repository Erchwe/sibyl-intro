import * as THREE from 'three'

export class BrainShape {
  constructor(count = 300, radius = 70) {
    this.points = []

    // Fibonacci sphere (uniform, solid-looking)
    const offset = 2 / count
    const increment = Math.PI * (3 - Math.sqrt(5)) // golden angle

    for (let i = 0; i < count; i++) {
      const y = ((i * offset) - 1) + (offset / 2)
      const r = Math.sqrt(1 - y * y)

      const phi = i * increment

      const x = Math.cos(phi) * r
      const z = Math.sin(phi) * r

      this.points.push(
        new THREE.Vector3(
          x * radius,
          y * radius,
          z * radius
        )
      )
    }
  }

  getPoint(i) {
    return this.points[i]
  }
}
