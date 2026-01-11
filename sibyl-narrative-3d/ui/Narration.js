import gsap from 'gsap'

export class Narration {
  constructor() {
    this.root = document.createElement('div')
    this.root.className = 'narration'
    document.body.appendChild(this.root)

    this.text = document.createElement('div')
    this.text.className = 'narration-text'
    this.root.appendChild(this.text)

    this.isVisible = false
  }

  show(content) {
    const html = this.parseEmphasis(content)

    if (this.isVisible) {
      gsap.to(this.text, {
        opacity: 0,
        filter: 'blur(6px)',
        duration: 0.35,
        ease: 'power2.out',
        onComplete: () => this._reveal(html)
      })
    } else {
      this._reveal(html)
    }
  }

  // 🔴 METODE BARU: Menghilangkan narasi sepenuhnya untuk Branding Final
  hide() {
    if (!this.isVisible) return
    gsap.to(this.text, {
      opacity: 0,
      filter: 'blur(12px)',
      duration: 1.5,
      ease: 'power2.inOut',
      onComplete: () => {
        this.isVisible = false
      }
    })
  }

  _reveal(html) {
    this.text.innerHTML = html

    gsap.fromTo(
      this.text,
      {
        opacity: 0,
        filter: 'blur(8px)'
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out'
      }
    )

    this.isVisible = true
  }

  parseEmphasis(text) {
    return text.replace(
      /\*\*(.*?)\*\*/g,
      '<span class="emphasis">$1</span>'
    )
  }
}