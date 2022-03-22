import { types } from "@theatre/core";
import Module from "library:modules/Module";
import HTMLActor from "library:tools/HTMLActor";
import SlipperyTrack from "library:tools/SlipperyTrack";
import Element from "./elements/Element";
import Segment from "./segments/Segment";

export type ScrollSettings = {
  type: 'smooth' | 'default',
  axis: 'x' | 'y',
  ease: number,
  history: boolean,
}

export default class Scroll extends Module<ScrollSettings> {

  public readonly actor: HTMLActor
  public readonly track = new SlipperyTrack()
  public readonly size = { viewport: 0, page: 0 }
  private deadZones: Array<HTMLElement> = []
  private elements: Array<Element> = []

  constructor(parameters: { body: HTMLElement, name?: string, settings?: Partial<ScrollSettings> }) {

    super()

    this.actor = new HTMLActor(parameters.body)
    this.name = parameters.name || 'scroll'
    this.layer = this.name
    this.autoTick = false

    this.useConfiguration({

      type: types.stringLiteral('smooth', { smooth: 'smooth', default: 'default' }),
      axis: types.stringLiteral('y', { x: 'x', y: 'y' }),
      ease: types.number(0.1, { range: [0, 0.3] }),
      history: false,
      ...parameters.settings

    })

  }


  public onLaunch() {

    this.history()
    this.toggleType()
    this.findDeadZones()
    this.track.ease = this.configuration!.value.ease
    this.actor.on()

  }


  public onReset() {

    this.actor.off()

    if (this.configuration!.value.history) {

      removeEventListener('beforeunload', this.writeHistory)
      this.writeHistory()

    }

  }


  private findDeadZones() {

    this.deadZones = [...document.querySelectorAll('[data-scroll-dzone]')] as Array<HTMLElement>

  }


  public checkIfInDeadZone(el: HTMLElement) {

    let match = false

    this.deadZones.forEach(dz => {
      if (match) return
      match = dz.contains(el)
    })

    return match

  }


  private history() {

    if (this.configuration!.value.history) {
      this.loadHistory()
    } else {
      this.eraseHistory()
    }

  }


  private loadHistory() {

    const progress = sessionStorage.getItem(this.name + location.pathname + '-progress')

    if (progress) {

      const parsedProgress = JSON.parse(progress)

      this.track.progress.exct = parsedProgress.exct
      this.track.progress.lerp = parsedProgress.lerp
      this.track.progress.nole = parsedProgress.nole
      this.track.progress.norm = parsedProgress.norm

    }

    addEventListener('beforeunload', this.writeHistory)

  }


  private writeHistory = () => {

    sessionStorage.setItem(this.name + location.pathname + '-progress', JSON.stringify(this.track.progress))

  }


  private eraseHistory() {

    sessionStorage.removeItem(this.name + location.pathname + '-progress')

  }


  public onSettingsChange(current: ScrollSettings, previous: ScrollSettings) {

    if (current.type !== previous.type) {

      this.toggleType()

    }


    this.track.ease = current.ease

  }


  private toggleType() {

    if (this.configuration!.value.type === 'smooth') {

      this.prepareSmoothType()

    } else {

      this.prepareDefaultType()

    }

  }


  private prepareSmoothType() {

    this.useTick(0)

    this.elements.forEach(element => element.useTick(1))
    this.elements = []

    this.actor.body.style.cssText = `
      overflow: auto;
    `

    this.actor.body.tabIndex = 0

    if (this.configuration?.previousValue.type === 'default') {

      const segments = this.findChildrenByType('segment') as Array<Segment>
      segments.forEach(segment => segment.launch('softResize'))

    }

  }


  private prepareDefaultType() {

    this.unuseTick()

    this.elements = this.findChildrenByType('element', true) as Array<Element>
    this.elements.forEach(element => element.unuseTick())

    this.actor.body.style.cssText = `
      overflow: auto;
      height: 100%;
      width: 100%;
    `

    this.actor.body.tabIndex = -1

    if (this.configuration?.previousValue.type === 'smooth') {

      const segments = this.findChildrenByType('segment') as Array<Segment>
      segments.forEach(segment => segment.conserve('softResize'))

    }

    this.nativeScroll()

  }


  public onResize() {

    this.actor.resize()
    this.calculateViewportSize()

  }


  public onAfterResize() {

    this.calculatePageSize()
    this.track.parameters(0, this.size.page)
    this.track.step(0)
    this.track.equalize()

  }


  private calculateViewportSize() {

    this.size.viewport =
      this.configuration!.value.axis === 'y'
        ? Math.min(innerHeight, this.actor.size.y)
        : Math.min(innerWidth, this.actor.size.x)

  }


  private calculatePageSize() {

    const segments = this.findChildrenByType('segment') as Array<Segment>

    if (this.configuration!.value.type === 'default') {

      this.size.page = this.actor.body.scrollHeight - this.size.viewport

    } else {

      this.size.page = segments.reduce((acc, curr) => {
        return acc + curr.actor.size[this.configuration!.value.axis]
      }, - this.size.viewport)

    }

  }


  public addForce(force: number, nativeScroll: boolean = false) {

    this.track.step(force)

    if (this.configuration!.value.type === 'default') {

      this.manualTick(nativeScroll)

    }

  }


  public setValue(newValue: number, nativeScroll: boolean = false) {

    this.track.progress.exct = 0
    this.addForce(newValue, nativeScroll)

  }


  public setValueN(newValue: number, nativeScroll: boolean = false) {

    this.setValue(this.track.length * newValue, nativeScroll)

  }


  public equalize() {

    this.track.equalize()

  }


  public onTick() {

    this.track.slide()

  }


  public manualTick = (nativeScroll: boolean = false) => {

    this.track.equalize()
    this.elements.forEach(element => element.tick())

    if (nativeScroll) this.nativeScroll()

  }


  private nativeScroll() {

    const { axis, type } = this.configuration!.value

    if (type === 'default') {

      this.actor.body.scroll(
        axis === 'x' ? this.track.progress.exct : 0,
        axis === 'y' ? this.track.progress.exct : 0
      )

    }

  }

}