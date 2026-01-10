import { World } from './World.js'
import { CameraRig } from './CameraRig.js'
import { Narration } from '../ui/Narration.js'

const SCRIPT = [
  'Welcome to **Sibyl Labs**.',

  'Trillions of **interactions** shape our world every second.',

  'Without navigation, **complex systems** are fragile and prone to failure.',

  '**The Sibyl Engine** extracts the logic behind behavior.'
]


export class SceneManager {
  constructor(scene, camera) {
    this.world = new World(scene)
    this.cameraRig = new CameraRig(camera)
    this.narration = new Narration()

    this.index = 0
    this.narration.show(SCRIPT[this.index])

    this.pendingAdvance = false

    this.world.onStateComplete = () => {
      if (this.pendingAdvance) {
        this.pendingAdvance = false
        this.advanceNarration()
      }
    }

    window.addEventListener('mousedown', () => {
      // ignore click while world busy
      if (this.world.isBusy) return
      this.pendingAdvance = true
      this.world.next()
    })
  }

  advanceNarration() {
    this.index++
    if (SCRIPT[this.index]) {
      this.narration.show(SCRIPT[this.index])
    }
  }

  update() {
    this.cameraRig.update()
    this.world.update()
  }
}
