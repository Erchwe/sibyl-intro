import { Vector3, MathUtils } from 'three'

export class CameraRig {
  constructor(camera) {
    this.camera = camera

    this.target = new Vector3(0, 15, 0)

    this.radius = 300            // default
    this.theta = 0
    this.phi = MathUtils.degToRad(70)

    this.minPhi = MathUtils.degToRad(30)
    this.maxPhi = MathUtils.degToRad(150)

    this.dragging = false
    this.start = { x: 0, y: 0 }
    this.startTheta = 0
    this.startPhi = 0

    this.initInput()
    this.updateCamera()
  }

  initInput() {
    window.addEventListener('mousedown', e => {
      this.dragging = true
      this.start.x = e.clientX
      this.start.y = e.clientY
      this.startTheta = this.theta
      this.startPhi = this.phi
    })

    window.addEventListener('mouseup', () => {
      this.dragging = false
    })

    window.addEventListener('mousemove', e => {
      if (!this.dragging) return
      const dx = (e.clientX - this.start.x) * 0.005
      const dy = (e.clientY - this.start.y) * 0.005
      this.theta = this.startTheta + dx
      this.phi = MathUtils.clamp(this.startPhi - dy, this.minPhi, this.maxPhi)
    })
  }

  updateCamera() {
    this.camera.position.set(
      this.target.x + this.radius * Math.sin(this.phi) * Math.cos(this.theta),
      this.target.y + this.radius * Math.cos(this.phi),
      this.target.z + this.radius * Math.sin(this.phi) * Math.sin(this.theta)
    )
    this.camera.lookAt(this.target)
  }

  update() {
    this.updateCamera()
  }
}
