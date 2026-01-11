import * as THREE from 'three'
import gsap from 'gsap'

export class CrucibleCore {
  constructor(scene) {
    this.scene = scene
    this.group = new THREE.Group()
    this.active = false
    this.isCompressing = false

    // 1. THE CORE (Inti yang akan menjadi api abadi)
    const coreGeo = new THREE.IcosahedronGeometry(6, 4) // Ukuran lebih kecil agar presisi
    
    this.emberMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending // Efek cahaya membara
    })

    this.coreMesh = new THREE.Mesh(coreGeo, this.emberMaterial)
    this.group.add(this.coreMesh)

    // 2. THE ATMOSPHERE (Aura tipis yang tidak menelan layar)
    const glowGeo = new THREE.SphereGeometry(10, 32, 32)
    this.glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff2200,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    })
    this.outerGlow = new THREE.Mesh(glowGeo, this.glowMaterial)
    this.group.add(this.outerGlow)

    // 3. LIGHTING
    this.light = new THREE.PointLight(0xff2200, 0, 150)
    this.group.add(this.light)

    this.scene.add(this.group)
    this.group.visible = false
  }

  activate() {
    this.active = true
    this.group.visible = true
    this.group.scale.set(0.1, 0.1, 0.1)
    
    gsap.to(this.group.scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.7)" })
    gsap.to(this.light, { intensity: 3, duration: 2 })
  }

  update() {
    if (!this.group.visible) return

    // Rotasi konstan agar terlihat hidup
    this.coreMesh.rotation.y += 0.012
    this.coreMesh.rotation.x += 0.007

    // Efek Berdenyut (Flicker Api)
    const flicker = 1.0 + Math.sin(Date.now() * 0.005) * 0.08
    this.coreMesh.scale.set(flicker, flicker, flicker)
    
    // Aura luar berdenyut lebih lambat
    const auraPulse = 1.0 + Math.cos(Date.now() * 0.002) * 0.1
    this.outerGlow.scale.set(auraPulse, auraPulse, auraPulse)
  }

  compress() {
    this.isCompressing = true
    return new Promise((resolve) => {
      // Step 1: Getaran Tekanan Tinggi
      gsap.to(this.coreMesh.position, {
        x: 0.5, y: 0.5,
        duration: 0.05, repeat: 10, yoyo: true
      })

      // Step 2: Implosion (Mengecil sejenak)
      gsap.to(this.group.scale, {
        x: 0.4, y: 0.4, z: 0.4,
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
          
          // Step 3: THE FORGE BLAST (Ledakan terkendali)
          // Inti TETAP ADA (tidak visible = false), hanya berubah ukuran
          gsap.to(this.coreMesh.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3 })
          
          // Aura meledak tapi dibatasi ukurannya agar tidak menelan layar
          gsap.to(this.outerGlow.scale, { 
            x: 2.2, y: 2.2, z: 2.2, 
            duration: 1.5, 
            ease: "power3.out" 
          })
          
          // Aura menjadi sangat transparan (residu panas tipis)
          gsap.to(this.glowMaterial, { opacity: 0.4, duration: 2 })
          
          // Warna core menjadi lebih terang (kuning emas membara)
          gsap.to(this.emberMaterial.color, { r: 1, g: 0.8, b: 0.2, duration: 1 })

          resolve() // Lanjut ke pemunculan Kristal
        }
      })
    })
  }
}