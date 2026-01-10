import { Vector3, MathUtils } from 'three'

export class CameraRig {
  constructor(camera) {
    this.camera = camera

    this.target = new Vector3(0, -20, 0)

    this.radius = 300
    this.theta = 0
    this.phi = MathUtils.degToRad(70)

    this.minPhi = MathUtils.degToRad(30)
    this.maxPhi = MathUtils.degToRad(150)

    this.dragging = false
    this.start = { x: 0, y: 0 }
    this.startTheta = 0
    this.startPhi = 0

    /* =========================
       JOURNEY CONTROL
    ========================= */
    this.drifting = false
    this.maxRadius = 520          // 🔴 TITIK AKHIR PERJALANAN
    this.radiusVelocity = 0.45

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
      this.phi = MathUtils.clamp(
        this.startPhi - dy,
        this.minPhi,
        this.maxPhi
      )
    })
  }

  /* =========================
     JOURNEY API
  ========================= */

  startJourney() {
    this.drifting = true
  }

  isJourneyComplete() {
    return this.radius >= this.maxRadius
  }

  updateCamera() {
    const x =
      this.target.x +
      this.radius * Math.sin(this.phi) * Math.cos(this.theta)
    const y =
      this.target.y +
      this.radius * Math.cos(this.phi)
    const z =
      this.target.z +
      this.radius * Math.sin(this.phi) * Math.sin(this.theta)

    this.camera.position.set(x, y, z)
    this.camera.lookAt(this.target)
  }

  update() {
    if (this.drifting) {
      this.radius += this.radiusVelocity

      // 🛑 STOP OTOMATIS
      if (this.radius >= this.maxRadius) {
        this.radius = this.maxRadius
        this.drifting = false
      }
    }

    this.updateCamera()
  }
}
