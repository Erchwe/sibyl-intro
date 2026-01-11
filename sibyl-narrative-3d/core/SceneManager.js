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
  'In the **Crucible**, we burn uncertainty through massive simulation.',
  '10,000 agents have perished to find this truth.',
  'The result is **The Sovereign Logic**.',
  'Feeding the **Immortal Memory**.',
  'Alexandria **remembers everything**.'
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

    // State Control
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
      // FIX: Jika sudah di tahap akhir (Kristal muncul), izinkan ganti teks terakhir
      if (this.isConcluded) {
        if (this.index < SCRIPT.length - 1) {
          this.advanceNarration()
        }
        return
      }

      // Guardrail standar untuk fase awal
      if (this.world.isBusy || this.isForging) return

      // Handle Journey Start (Sphere Stage)
      if (this.world.state === 'brain' && !this.journeyStarted) {
        this.startJourney()
        return
      }

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

    // Visual Collapse: Cloud mengecil ke arah pusat
    if (this.world.cloud) {
      gsap.to(this.world.cloud.group.scale, {
        x: 0.05, y: 0.05, z: 0.05,
        duration: 2.0,
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

    // 1. Ignite Crucible (Teks: In the Crucible)
    if (SCRIPT[this.index].includes('In the **Crucible**') && !this.observatoryClosed) {
      this.closeObservatoryAndIgniteCrucible()
    }

    // 2. Journey End -> Next Stage
    if (this.journeyStarted && !this.journeyFinished && this.cameraRig.isJourneyComplete()) {
      this.journeyFinished = true
      this.advanceNarration() 
      this.world.next() 
    }

    // 3. Logic: Seed Alone (Setelah cloud benar-benar hilang)
    const seed = this.world.seed
    if (seed && !this.world.cloud && this.observatoryClosed && !this.seedEnteredAlone) {
      this.seedEnteredAlone = true
      seed.enterAlone()
    }

    // 4. Logic: Core Emergence & Start Heating
    if (this.seedEnteredAlone && !this.seedHeatingStarted && seed.isAloneComplete()) {
      this.seedHeatingStarted = true
      seed.startHeating()
      this.core.activate()
    }

    // 5. THE FORGE: Transisi ke Kristal
    if (this.seedHeatingStarted && seed.timer > 4.5 && !this.isForging) {
      this.isForging = true
      this.advanceNarration() // Tampilkan: "10,000 agents have perished..."
      seed.morphOut()
      
      this.core.compress().then(() => {
        // SETELAH COMPRESS SELESAI: Munculkan Kristal tapi jangan ganti teks otomatis
        this.triggerConclusionAppearance()
      })
    }
  }

  triggerConclusionAppearance() {
    this.isConcluded = true // Membuka blokir klik di initInputs
    this.conclusion.reveal()
    
    // Zoom in fokus pada hasil
    gsap.to(this.cameraRig, { 
      radius: 130, 
      phi: Math.PI / 2, 
      duration: 3, 
      ease: "expo.inOut" 
    })
  }
}