import * as THREE from 'three'
import gsap from 'gsap'
import { BrainShape } from './BrainShape.js'

export class NodeCloud {
  constructor(scene) {
    this.group = new THREE.Group()
    scene.add(this.group)

    /* =========================
       NODES
    ========================= */
    this.nodes = []
    const geo = new THREE.SphereGeometry(1.5, 8, 8)
    const mat = new THREE.MeshBasicMaterial({ color: 0x3cffb1 })

    for (let i = 0; i < 300; i++) {
      const target = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(180),
        THREE.MathUtils.randFloatSpread(120),
        THREE.MathUtils.randFloatSpread(180)
      )

      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(0, 0, 0)
      this.group.add(mesh)

      this.nodes.push({
        mesh,
        target,
        base: target.clone(),
        chaosSeed: Math.random() * 10
      })
    }

    /* =========================
       CONNECTIONS
    ========================= */
    this.mode = 'idle'              // idle | complexity | chaos | brain
    this.connectionsActive = false

    this.connections = []
    this.connectionMaterial = new THREE.LineBasicMaterial({
      color: 0x3cffb1,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false
    })

    this.connectionGeometry = new THREE.BufferGeometry()
    this.connectionPositions = new Float32Array(0)
    this.connectionMesh = new THREE.LineSegments(
      this.connectionGeometry,
      this.connectionMaterial
    )
    this.group.add(this.connectionMesh)

    this.buildComplexityConnections()

    /* =========================
       BRAIN SHAPE
    ========================= */
    this.brainShape = new BrainShape(this.nodes.length)

    this.group.visible = false
  }

  /* =========================
     CONNECTION BUILDERS
  ========================= */

  buildComplexityConnections() {
    this.connections = []

    const maxDist = 55
    const maxPerNode = 2

    for (let i = 0; i < this.nodes.length; i++) {
      let count = 0
      const a = this.nodes[i].target.clone()

      for (let j = i + 1; j < this.nodes.length; j++) {
        if (count >= maxPerNode) break
        const b = this.nodes[j].target.clone()

        if (a.distanceTo(b) < maxDist) {
          this.connections.push({
            a, b,
            progress: 0,
            speed: 0.02,
            breakChance: Math.random(),
            flickerSpeed: 0.6 + Math.random()
          })
          count++
        }
      }
    }

    this.rebuildGeometry()
  }

  buildBrainConnections() {
    this.connections = []

    const maxDist = 34
    const maxPerNode = 1

    for (let i = 0; i < this.nodes.length; i++) {
      let count = 0
      const a = this.brainShape.getPoint(i)

      for (let j = i + 1; j < this.nodes.length; j++) {
        if (count >= maxPerNode) break
        const b = this.brainShape.getPoint(j)

        if (a.distanceTo(b) < maxDist) {
          this.connections.push({
            a, b,
            progress: 0,
            speed: 0.05,
            breakChance: 0
          })
          count++
        }
      }
    }

    this.rebuildGeometry()
  }

  rebuildGeometry() {
    this.connectionPositions = new Float32Array(
      this.connections.length * 2 * 3
    )
    this.connectionGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.connectionPositions, 3)
    )
  }

  /* =========================
     SCENE MODES
  ========================= */

  morphIn() {
    this.group.visible = true
    this.mode = 'complexity'
    this.connectionsActive = false

    this.connections.forEach(c => (c.progress = 0))

    this.nodes.forEach((n, i) => {
      gsap.to(n.mesh.position, {
        x: n.target.x,
        y: n.target.y,
        z: n.target.z,
        delay: i * 0.002,
        duration: 1.6,
        ease: 'power3.out'
      })
    })

    gsap.delayedCall(1.7, () => {
      this.connectionsActive = true
      gsap.to(this.connectionMaterial, {
        opacity: 0.12,
        duration: 1.2
      })
    })
  }

  enterChaos() {
    this.mode = 'chaos'
    this.nodes.forEach(n => n.base.copy(n.mesh.position))
  }

  enterBrain() {
    this.mode = 'brain'
    this.connectionsActive = false

    // fade out chaos graph
    gsap.to(this.connectionMaterial, {
      opacity: 0,
      duration: 0.6
    })

    // move nodes
    this.nodes.forEach((n, i) => {
      const p = this.brainShape.getPoint(i)
      gsap.to(n.mesh.position, {
        x: p.x,
        y: p.y,
        z: p.z,
        duration: 2.4,
        ease: 'power3.inOut'
      })
      n.base.copy(p)
    })

    // rebuild clean brain graph
    gsap.delayedCall(1.9, () => {
      this.buildBrainConnections()
      this.connectionsActive = true
      gsap.to(this.connectionMaterial, {
        opacity: 0.22,
        duration: 1.2
      })
    })
  }

  /* =========================
     UPDATE LOOP
  ========================= */

  update() {
    if (!this.group.visible) return

    const t = performance.now() * 0.001

    if (this.mode === 'chaos') {
      this.nodes.forEach(n => {
        n.mesh.position.x =
          n.base.x + Math.sin(t + n.chaosSeed) * 2.5
        n.mesh.position.y =
          n.base.y + Math.sin(t * 1.4 + n.chaosSeed) * 2
      })
    }

    if (!this.connectionsActive) return

    let ptr = 0

    for (const c of this.connections) {
      if (this.mode === 'complexity') {
        c.progress = Math.min(1, c.progress + c.speed)
      } else if (this.mode === 'chaos') {
        c.progress += c.breakChance > 0.8 ? -0.03 : 0.01
      } else if (this.mode === 'brain') {
        c.progress = Math.min(1, c.progress + 0.05)
      }

      c.progress = THREE.MathUtils.clamp(c.progress, 0, 1)

      const end = new THREE.Vector3().lerpVectors(
        c.a, c.b, c.progress
      )

      this.connectionPositions[ptr++] = c.a.x
      this.connectionPositions[ptr++] = c.a.y
      this.connectionPositions[ptr++] = c.a.z
      this.connectionPositions[ptr++] = end.x
      this.connectionPositions[ptr++] = end.y
      this.connectionPositions[ptr++] = end.z
    }

    this.connectionGeometry.attributes.position.needsUpdate = true
  }
}
