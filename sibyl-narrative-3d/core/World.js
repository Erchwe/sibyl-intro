import { StarField } from '../world/StarField.js'
import { SeedNode } from '../world/SeedNode.js'
import { NodeCloud } from '../world/NodeCloud.js'

export class World {
  constructor(scene) {
    this.starfield = new StarField(scene)
    this.seed = new SeedNode(scene)
    this.cloud = new NodeCloud(scene)

    this.state = 'seed'
    this.isTransitioning = false
  }

  next() {
    if (this.isTransitioning) return

    if (this.state === 'seed') {
      this.isTransitioning = true
      this.seed.morphOut()
      this.cloud.morphIn()

      setTimeout(() => {
        this.state = 'complexity'
        this.isTransitioning = false
      }, 1800)
    }

    else if (this.state === 'complexity') {
      this.state = 'chaos'
      this.cloud.enterChaos()
    }

    else if (this.state === 'chaos') {
      this.state = 'brain'
      this.cloud.enterBrain()
    }
  }

  update() {
    this.starfield.update()
    this.seed.update()
    this.cloud.update()
  }
}
