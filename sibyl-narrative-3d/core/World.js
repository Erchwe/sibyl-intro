import { StarField } from '../world/StarField.js'
import { SeedNode } from '../world/SeedNode.js'
import { NodeCloud } from '../world/NodeCloud.js'

export class World {
  constructor(scene) {
    this.scene = scene
    this.starfield = new StarField(scene)
    this.seed = new SeedNode(scene)
    this.cloud = new NodeCloud(scene)

    this.state = 'seed'
    this.isBusy = false
    this.onStateComplete = null

    // link seed → cloud
    this.cloud.setSeed(this.seed.mesh)
  }

  next() {
    if (this.isBusy) return

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

    else if (this.state === 'complexity') {
      this.isBusy = true
      this.cloud.enterChaos()

      setTimeout(() => {
        this.state = 'chaos'
        this.isBusy = false
        this.onStateComplete?.()
      }, 1200)
    }

    else if (this.state === 'chaos') {
      this.isBusy = true
      this.cloud.enterBrain()

      setTimeout(() => {
        this.state = 'brain'
        this.isBusy = false
        this.onStateComplete?.()
      }, 2600)
    }

    else if (this.state === 'brain') {
      this.isBusy = true
      this.cloud.enterCollapse()

      this.state = 'collapse'
      this.isBusy = false
    }
  }

  update() {
    this.starfield.update()
    this.seed.update()

    if (this.cloud && !this.cloud.finished) {
      this.cloud.update()
    }

    // FINAL LIFECYCLE TERMINATION
    if (this.cloud && this.cloud.finished) {
      this.cloud.finalize()
      this.cloud = null
    }
  }
}
