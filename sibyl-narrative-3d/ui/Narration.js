import gsap from 'gsap'

export class Narration {
  constructor() {
    this.el = document.createElement('div')
    this.el.style.cssText = `
      position: fixed;
      bottom: 12%;
      width: 100%;
      text-align: center;
      font-family: Inter, system-ui, sans-serif;
      font-size: 20px;
      color: #e6fff4;
      opacity: 0;
      filter: blur(8px);
      pointer-events: none;
    `
    document.body.appendChild(this.el)
  }

  show(text) {
    this.el.textContent = text
    gsap.to(this.el, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'power3.out'
    })
  }
}
