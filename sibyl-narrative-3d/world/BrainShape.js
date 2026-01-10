import * as THREE from 'three'

export class BrainShape {
  constructor(count = 300) {
    this.points = []

    const layers = [
      { y: 32, r: 52 },
      { y: 18, r: 62 },
      { y: 0,  r: 70 },
      { y: -18, r: 60 },
      { y: -32, r: 48 }
    ]

    let i = 0
    while (this.points.length < count) {
      const layer = layers[i % layers.length]
      const side = i % 2 === 0 ? -1 : 1

      const angle = (i / count) * Math.PI * 6
      const wobble = Math.sin(i * 0.4) * 5

      this.points.push(
        new THREE.Vector3(
          Math.cos(angle) * layer.r + side * 18,
          layer.y + wobble,
          Math.sin(angle) * layer.r
        )
      )
      i++
    }
  }

  getPoint(i) {
    return this.points[i % this.points.length]
  }
}
