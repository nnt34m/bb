import Stats from 'three/examples/jsm/libs/stats.module'


export class Ticker {

  private lastFrameId: number = 0
  private removeTimeoutsIds: WeakMap<Function, number> = new WeakMap()
  private callbacks: Array<Function> = []
  private order: Map<Function, number> = new Map()

  public tick = (t: number) => {

    this.lastFrameId = requestAnimationFrame(this.tick)
    this.callbacks.forEach(callback => callback(t))

  }


  public stop() {

    cancelAnimationFrame(this.lastFrameId)
    this.lastFrameId = 0

  }


  public run() {

    this.lastFrameId = requestAnimationFrame(this.tick)

  }


  public add(callback: Function, position: number = 1) {

    if (this.removeTimeoutsIds.has(callback)) {
      clearTimeout(this.removeTimeoutsIds.get(callback))
      this.removeTimeoutsIds.delete(callback)
    }

    if (this.callbacks.find(cb => cb === callback)) return;

    this.order.set(callback, position)
    const callbacks = Array.from(this.order)
    callbacks.sort((a, b) => a[1] - b[1])
    this.callbacks = callbacks.map(callback => callback[0])

    if (this.callbacks.length && !this.lastFrameId) {
      this.run()
    }

  }


  public remove(callback: Function) {

    const index = this.callbacks.indexOf(callback)
    if (index < 0) return;

    this.order.delete(callback)
    this.callbacks.splice(index, 1)

    if (!this.callbacks.length && this.lastFrameId) {
      this.stop()
    }

  }


  public removeAfterDelay(callback: Function, delay = 2000) {

    if (this.removeTimeoutsIds.has(callback)) return;

    this.removeTimeoutsIds.set(callback, setTimeout(() => {

      this.remove(callback)
      this.removeTimeoutsIds.delete(callback)

    }, delay))

  }

}

const ticker = new Ticker()

if (import.meta.env.DEV) {

  const stats = Stats()
  const el = document.createElement('div')
  el.style.cssText = `
    position: fixed;
    z-index: 100;
    bottom: 0;
    right: 0;
    opacity: 1;
  `
  stats.dom.style.position = 'relative'
  el.appendChild(stats.dom)
  document.body.appendChild(el)

  ticker.tick = (t) => {
    stats.begin()
    //@ts-ignore
    ticker.callbacks.forEach(callback => callback(t))
    stats.end()
    //@ts-ignore
    ticker.lastFrameId = requestAnimationFrame(ticker.tick)
  }

}

export default ticker