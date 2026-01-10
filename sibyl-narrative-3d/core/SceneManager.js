import { World } from './World.js'
import { CameraRig } from './CameraRig.js'
import { Narration } from '../ui/Narration.js'

const SCRIPT = [
  'Welcome to Sibyl Labs.',
  'Triliunan interaksi menggerakkan dunia kita setiap detik.',
  'Namun tanpa navigasi, sistem kompleks sangat rentan terhadap kegagalan.',
  'Sibyl Engine mengekstraksi logika di balik setiap perilaku.'
]

export class SceneManager {
  constructor(scene, camera) {
    this.world = new World(scene)
    this.cameraRig = new CameraRig(camera)
    this.narration = new Narration()

    this.index = 0
    this.narration.show(SCRIPT[this.index])

    this.isDown = false
    this.drag = 0
    this.threshold = 6

    window.addEventListener('mousedown', () => {
      this.isDown = true
      this.drag = 0
    })

    window.addEventListener('mousemove', e => {
      if (!this.isDown) return
      this.drag += Math.abs(e.movementX) + Math.abs(e.movementY)
    })

    window.addEventListener('mouseup', () => {
      if (!this.isDown) return
      this.isDown = false

      if (this.drag < this.threshold) {
        this.index++
        this.world.next()

        if (SCRIPT[this.index]) {
          this.narration.show(SCRIPT[this.index])
        }
      }
    })
  }

  update() {
    this.cameraRig.update()
    this.world.update()
  }
}
