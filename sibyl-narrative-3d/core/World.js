import { StarField } from '../world/StarField.js'
import { SeedNode } from '../world/SeedNode.js'
import { NodeCloud } from '../world/NodeCloud.js'

export class World {
  constructor(scene) {
    this.starfield = new StarField(scene)
    this.seed = new SeedNode(scene)
    this.cloud = new NodeCloud(scene)

    this.state = 'seed'
    this.isBusy = false

    this.onStateComplete = null
  }

  next() {
    if (this.isBusy) return

    /* ===== SEED → COMPLEXITY ===== */
    if (this.state === 'seed') {
      this.isBusy = true
      this.seed.morphOut()
      this.cloud.morphIn()

      setTimeout(() => {
        this.state = 'complexity'
        this.isBusy = false
        this.onStateComplete?.()
      }, 1800)
    }

    /* ===== COMPLEXITY → CHAOS ===== */
    else if (this.state === 'complexity') {
      this.isBusy = true
      this.cloud.enterChaos()

      // chaos needs time to "form"
      setTimeout(() => {
        this.state = 'chaos'
        this.isBusy = false
        this.onStateComplete?.()
      }, 1200)
    }

    /* ===== CHAOS → BRAIN ===== */
    else if (this.state === 'chaos') {
      this.isBusy = true
      this.cloud.enterBrain()

      // brain formation duration
      setTimeout(() => {
        this.state = 'brain'
        this.isBusy = false
        this.onStateComplete?.()
      }, 2600)
    }
  }

  update() {
    this.starfield.update()
    this.seed.update()
    this.cloud.update()
  }
}
