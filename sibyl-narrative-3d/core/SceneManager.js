import * as THREE from 'three'
import gsap from 'gsap'
import { World } from './World.js'
import { CameraRig } from './CameraRig.js'
import { Narration } from '../ui/Narration.js'
import { CrucibleAmbience } from '../world/CrucibleAmbience.js'
import { CrucibleCore } from '../world/CrucibleCore.js'
import { ConclusionCrystal } from '../world/ConclusionCrystal.js'

const SCRIPT = [
  'Every system begins with a **single assumption**.',
  'Trillions of **interactions** shape our world every second.',
  'Without navigation, **complex systems are fragile**.',
  'The **Sibyl Engine** extracts the logic behind behavior.',
  'We now **leave the observatory**.',
  'In the **Crucible**, we burn uncertainty through massive simulation.',
  '10,000 agents have perished to find this truth.',
  'The result is **The Sovereign Logic**.'
]

export class SceneManager {
  constructor(scene, camera) {
    this.scene = scene

    this.world = new World(scene)
    this.cameraRig = new CameraRig(camera)
    this.narration = new Narration()
    this.ambience = new CrucibleAmbience(scene)
    this.core = new CrucibleCore(scene)
    this.conclusion = new ConclusionCrystal(scene)

    this.index = 0
    this.narration.show(SCRIPT[this.index])
    this.scene.background = new THREE.Color(0x0b0b0b)

    // State Management
    this.journeyStarted = false
    this.journeyFinished = false
    this.observatoryClosed = false
    this.seedEnteredAlone = false
    this.seedHeatingStarted = false
    this.isForging = false
    this.isConcluded = false

    this.initInputs()
  }

  initInputs() {
    window.addEventListener('mousedown', () => {
      if (this.world.isBusy || this.isForging) return

      // Handle Journey Start
      if (this.world.state === 'brain' && !this.journeyStarted) {
        this.startJourney()
        return
      }

      // Default Advance
      this.world.next()
      this.advanceNarration()
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

    // Visual feedback: Cloud collapses and fades
    if (this.world.cloud) {
      gsap.to(this.world.cloud.group.scale, {
        x: 0.1, y: 0.1, z: 0.1,
        duration: 2.5,
        ease: 'power4.in'
      })
    }

    this.ambience.activate()
  }

  update() {
    this.cameraRig.update()
    this.world.update()
    this.ambience.update(this.core.group.position)
    this.core.update()
    this.conclusion.update()

    // 1. Trigger: Leaving the Observatory
    if (SCRIPT[this.index] === 'We now **leave the observatory**.' && !this.observatoryClosed) {
      this.closeObservatoryAndIgniteCrucible()
    }

    // 2. Trigger: Journey End -> Move to Crucible Script
    if (this.journeyStarted && !this.journeyFinished && this.cameraRig.isJourneyComplete()) {
      this.journeyFinished = true
      this.advanceNarration() // Move to "In the Crucible..."
      this.world.next() // Trigger cloud collapse
    }

    // 3. Logic: Seed Alone (Setelah cloud benar-benar hilang)
    const seed = this.world.seed
    // Kita cek nullity karena World.js menghapus cloud saat finished
    if (seed && !this.world.cloud && this.observatoryClosed && !this.seedEnteredAlone) {
      this.seedEnteredAlone = true
      seed.enterAlone()
    }

    // 4. Logic: Heating & Core Emergence
    if (this.seedEnteredAlone && !this.seedHeatingStarted && seed.isAloneComplete()) {
      this.seedHeatingStarted = true
      seed.startHeating()
      this.core.activate()
    }

    // 5. THE FORGE: Transisi ke Kesimpulan Final
    if (this.seedHeatingStarted && seed.timer > 4.0 && !this.isForging) {
      this.isForging = true
      this.advanceNarration() // "10,000 agents have perished..."
      
      seed.morphOut()
      this.core.compress().then(() => {
        this.triggerConclusion()
      })
    }
  }

  triggerConclusion() {
    this.isConcluded = true
    this.advanceNarration() // "The result is The Sovereign Logic."
    this.conclusion.reveal()
    
    // Final Camera Focus: Intimate & Sharp
    gsap.to(this.cameraRig.target, { x: 0, y: 0, z: 0, duration: 2.5 })
    gsap.to(this.cameraRig, { 
      radius: 120, 
      phi: Math.PI / 2, 
      duration: 3, 
      ease: "expo.inOut" 
    })
  }
}