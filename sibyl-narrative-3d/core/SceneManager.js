import * as THREE from 'three'
import gsap from 'gsap'
import { World } from './World.js'
import { CameraRig } from './CameraRig.js'
import { Narration } from '../ui/Narration.js'
import { CrucibleAmbience } from '../world/CrucibleAmbience.js'
import { CrucibleCore } from '../world/CrucibleCore.js'

const SCRIPT = [
  'Every system begins with a **single assumption**.',
  'Trillions of **interactions** shape our world every second.',
  'Without navigation, **complex systems are fragile**.',
  'The **Sibyl Engine** extracts the logic behind behavior.',
  'We now **leave the observatory**.',
  'In the **Crucible**, we burn uncertainty through massive simulation.'
]

export class SceneManager {
  constructor(scene, camera) {
    this.scene = scene

    this.world = new World(scene)
    this.cameraRig = new CameraRig(camera)
    this.narration = new Narration()
    this.ambience = new CrucibleAmbience(scene)
    this.core = new CrucibleCore(scene)
    this.seedEnteredAlone = false
    this.seedHeatingStarted = false


    this.index = 0
    this.pendingAdvance = false

    this.narration.show(SCRIPT[this.index])

    this.scene.background = new THREE.Color(0x0b0b0b)

    this.journeyStarted = false
    this.journeyFinished = false
    this.scriptAdvancedAfterJourney = false
    this.observatoryClosed = false

    this.world.onStateComplete = () => {
      if (!this.pendingAdvance) return
      this.pendingAdvance = false
      this.advanceNarration()
    }

    window.addEventListener('mousedown', () => {
      if (this.world.isBusy) return

      if (this.world.state === 'brain' && !this.journeyStarted) {
        this.startJourney()
        return
      }

      this.pendingAdvance = true
      this.world.next()
    })
  }

  startJourney() {
    this.journeyStarted = true
    this.world.starfield.enterDim()
    this.cameraRig.startJourney()
  }

  advanceNarration() {
    this.index++
    if (SCRIPT[this.index]) {
      this.narration.show(SCRIPT[this.index])
    }
  }

  closeObservatoryAndIgniteCrucible() {
    if (this.observatoryClosed) return
    this.observatoryClosed = true

    // Overlap fade-out + emergence
    gsap.to(this.world.cloud.group.scale, {
      x: 0.85,
      y: 0.85,
      z: 0.85,
      duration: 1.8,
      ease: 'power2.inOut'
    })

    this.ambience.activate()
    this.core.activate()
  }

update() {
  // ===== BASE UPDATE (TIDAK DIUBAH) =====
  this.cameraRig.update()
  this.world.update()
  this.ambience.update()
  this.core.update()

  // ===== JOURNEY COMPLETE LOGIC (TIDAK DIUBAH) =====
  if (
    this.journeyStarted &&
    !this.journeyFinished &&
    this.cameraRig.isJourneyComplete()
  ) {
    this.journeyFinished = true

    if (!this.scriptAdvancedAfterJourney) {
      this.scriptAdvancedAfterJourney = true
      this.advanceNarration()
    }

    this.pendingAdvance = true
    this.world.next()
  }

  // ===== TRIGGER LEAVING OBSERVATORY (TIDAK DIUBAH) =====
  if (
    SCRIPT[this.index] === 'We now **leave the observatory**.' &&
    !this.observatoryClosed
  ) {
    this.closeObservatoryAndIgniteCrucible()
  }

  // ===== SEED UPDATE (NEW, SAFE) =====
  if (this.seed) {
    this.seed.update()
  }

  // ===== PHASE: SEED SENDIRIAN =====
  // Syarat:
  // - observatory sudah ditutup
  // - nodecloud sudah selesai collapse (strength >= 1)
  // - belum masuk fase alone
  if (
    this.observatoryClosed &&
    !this.seedEnteredAlone &&
    this.world.cloud &&
    this.world.cloud.collapseStrength >= 1
  ) {
    this.seedEnteredAlone = true
    this.seed.enterAlone()
  }

  // ===== PHASE: START HEATING =====
  if (
    this.seedEnteredAlone &&
    !this.seedHeatingStarted &&
    this.seed.isAloneComplete()
  ) {
    this.seedHeatingStarted = true
    this.seed.startHeating()
  }

  // ===== PHASE: CRUCIBLE CORE EMERGENCE =====
  if (
    this.seedHeatingStarted &&
    !this.core.active &&
    this.seed.timer > 1.8
  ) {
    this.world.cloud.group.visible = false
    this.core.activate()
  }
}

}
