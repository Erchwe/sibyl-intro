import * as THREE from 'three'
import gsap from 'gsap'
import { World } from './World.js'
import { CameraRig } from './CameraRig.js'
import { Narration } from '../ui/Narration.js'
import { CrucibleAmbience } from '../world/CrucibleAmbience.js'
import { CrucibleCore } from '../world/CrucibleCore.js'
import { ConclusionCrystal } from '../world/ConclusionCrystal.js'
import { AlexandriaUplink } from '../world/AlexandriaUplink.js'
import { AlexandriaEnvironment } from '../world/AlexandriaEnvironment.js'

const SCRIPT = [
  'Every system begins with a **single assumption**.',
  'Trillions of **interactions** shape our world every second.',
  'Without navigation, **complex systems are fragile**.',
  'The **Sibyl Engine** extracts the logic behind behavior.',
  'In the **Crucible**, we burn uncertainty through massive simulation.',
  '10,000 agents have perished to find this truth.',
  'The result is **The Sovereign Logic**.',
  'Feeding the **Immortal Memory**.',
  'Alexandria **remembers everything**.',
  'This is not a library. It is an **Indestructible Civilization**.',
  'Every failure is a lesson. Every lesson is an **Asset**.',
  'Welcome to the **Sovereign Future**.'
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
    this.uplink = new AlexandriaUplink(scene)
    this.alexandriaEnv = new AlexandriaEnvironment(scene)

    this.index = 0
    this.narration.show(SCRIPT[this.index])
    this.scene.background = new THREE.Color(0x0b0b0b)

    // States Management
    this.journeyStarted = false
    this.journeyFinished = false
    this.observatoryClosed = false
    this.seedEnteredAlone = false
    this.seedHeatingStarted = false
    this.isForging = false
    this.isConcluded = false
    this.uplinkStarted = false
    this.isAlexandriaRevealed = false
    this.brandingShown = false
    
    this.isInputLocked = false 
    this.lockTimer = null

    this.initInputs()
    this.createFlashOverlay()
    this.createBranding() 
  }

  createFlashOverlay() {
    this.flash = document.createElement('div')
    this.flash.style.position = 'fixed'
    this.flash.style.top = '0'; this.flash.style.left = '0'
    this.flash.style.width = '100vw'; this.flash.style.height = '100vh'
    this.flash.style.backgroundColor = 'white'
    this.flash.style.opacity = '0'; this.flash.style.pointerEvents = 'none'
    this.flash.style.zIndex = '9999'
    document.body.appendChild(this.flash)
  }

  createBranding() {
    this.brandContainer = document.createElement('div')
    this.brandContainer.id = 'sibyl-branding'
    this.brandContainer.innerHTML = `
      <img src="/logo-sibyl.svg" class="sibyl-logo-img" alt="Logo">
      <div class="sibyl-text-wrapper">
        <span class="text-white">SIBYL</span><span class="glow-text-green">LABS</span>
      </div>
    `
    document.body.appendChild(this.brandContainer)
  }

  lockInput(duration = 1000) {
    if (this.lockTimer) clearTimeout(this.lockTimer)
    this.isInputLocked = true
    this.lockTimer = setTimeout(() => {
      this.isInputLocked = false
      this.lockTimer = null
    }, duration)
  }

  initInputs() {
    window.addEventListener('mousedown', () => {
      // 1. GUARD PRIORITAS: Jangan pernah proses klik jika input sedang dikunci
      if (this.isInputLocked) return

      const currentText = SCRIPT[this.index]

      // 2. LOGIKA KESIMPULAN (Fase setelah Forge selesai)
      if (this.isConcluded) {
        if (this.index < SCRIPT.length - 1) {
          // Anti-spam dinamis untuk transisi Alexandria
          const lockTime = SCRIPT[this.index + 1].includes('Feeding') || 
                           SCRIPT[this.index + 1].includes('Indestructible') ? 4000 : 1500;
          
          this.lockInput(lockTime)
          this.advanceNarration()
          
          if (SCRIPT[this.index].includes('Feeding the **Immortal Memory**')) this.triggerAlexandriaUplink()
          if (SCRIPT[this.index].includes('Indestructible Civilization')) this.triggerGreatJump()
        } else if (!this.brandingShown) {
          this.lockInput(5000)
          this.showFinalBranding()
        }
        return
      }

      // 3. AUTOMATED PHASE GUARD (Mencegah klik saat proses Crucible berjalan)
      // Hanya izinkan klik pada 10,000 agents JIKA proses Forge (isConcluded) sudah selesai.
      if (currentText.includes('In the **Crucible**') || currentText.includes('10,000 agents')) {
        return 
      }

      // 4. OBSERVATORY FLOW
      if (this.world.isBusy || this.isForging) return
      
      if (this.world.state === 'brain' && !this.journeyStarted) {
        this.lockInput(1500)
        this.startJourney()
        return
      }

      this.lockInput(1000)
      this.world.next()
      this.advanceNarration()
    })
  }

  advanceNarration() {
    this.index++
    if (SCRIPT[this.index]) {
      this.narration.show(SCRIPT[this.index])
    }
  }

  startJourney() {
    this.journeyStarted = true
    this.world.starfield.enterDim()
    this.cameraRig.startJourney()
  }

  triggerAlexandriaUplink() {
    if (this.uplinkStarted) return
    this.uplinkStarted = true
    this.lockInput(8000)
    
    this.uplink.ignite()
    if (this.core) {
        gsap.to(this.core.group.scale, { x: 0.1, z: 0.1, y: 15, duration: 3, ease: "power2.in" })
        gsap.to(this.core.emberMaterial, { opacity: 0, duration: 2.5 })
    }
    gsap.to(this.cameraRig.target, { y: 650, duration: 9, ease: "power2.inOut" })
    gsap.to(this.cameraRig, { radius: 380, duration: 9, ease: "power2.inOut" })
  }

  triggerGreatJump() {
    if (this.isAlexandriaRevealed) return
    this.isAlexandriaRevealed = true
    this.lockInput(6000)

    gsap.to(this.flash, {
      opacity: 1, duration: 1.5,
      onComplete: () => {
        if (this.core) this.scene.remove(this.core.group)
        if (this.conclusion) this.scene.remove(this.conclusion.group)
        if (this.uplink) this.scene.remove(this.uplink.group)
        if (this.ambience) this.scene.remove(this.ambience.group)
        this.scene.background = new THREE.Color(0x050a0a)
        this.alexandriaEnv.show()
        this.cameraRig.target.set(0, 0, 0)
        this.cameraRig.radius = 450
        this.cameraRig.phi = Math.PI / 2.5
        gsap.to(this.flash, { opacity: 0, duration: 2.5, delay: 0.8 })
      }
    })
  }

  showFinalBranding() {
    this.brandingShown = true
    this.narration.hide() 
    gsap.to(this.brandContainer, {
      opacity: 1, duration: 3, ease: "power3.out",
      onStart: () => { gsap.from(this.brandContainer, { scale: 0.7, duration: 4, ease: "power2.out" }) }
    })
    gsap.to(this.scene.background, { r: 0.02, g: 0.08, b: 0.05, duration: 5 })
  }

  update() {
    this.cameraRig.update(); this.world.update()
    this.ambience.update(this.core.group.position); this.core.update()
    this.conclusion.update(); this.uplink.update()

    if (SCRIPT[this.index].includes('In the **Crucible**') && !this.observatoryClosed) {
      this.closeObservatoryAndIgniteCrucible()
    }

    if (this.journeyStarted && !this.journeyFinished && this.cameraRig.isJourneyComplete()) {
      this.journeyFinished = true
      this.advanceNarration() 
      this.world.next() 
    }

    const seed = this.world.seed
    if (seed && !this.world.cloud && this.observatoryClosed && !this.seedEnteredAlone) {
      this.seedEnteredAlone = true
      seed.enterAlone()
    }

    if (this.seedEnteredAlone && !this.seedHeatingStarted && seed.isAloneComplete()) {
      this.seedHeatingStarted = true
      seed.startHeating()
      this.core.activate()
    }

    if (this.seedHeatingStarted && seed.timer > 4.5 && !this.isForging) {
      this.isForging = true
      this.advanceNarration() 
      seed.morphOut()
      this.core.compress().then(() => {
        // PENTING: Flag ini sekarang membebaskan guardrail klik manual
        this.isConcluded = true 
        this.conclusion.reveal()
        gsap.to(this.cameraRig, { radius: 130, phi: Math.PI / 2, duration: 3, ease: "expo.inOut" })
      })
    }
  }

  closeObservatoryAndIgniteCrucible() {
    this.observatoryClosed = true
    if (this.world.cloud) {
      gsap.to(this.world.cloud.group.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 2.5, ease: 'power4.in' })
    }
    this.ambience.activate()
  }
}