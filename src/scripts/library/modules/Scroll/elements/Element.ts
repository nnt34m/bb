import { types } from "@theatre/core"
import Module from "library:modules/Module"
import Actor from "library:tools/Actor"
import { KV } from "library:types"
import Scroll from ".."

export type ElementSettings = {

  length: number
  offset: number
  cut: number
  checkLength: number

}


export type ElementStatuses = {

  captured: boolean,
  released: boolean,
  capturedFromStart: boolean,
  capturedFromFinish: boolean,
  releasedFromStart: boolean,
  releasedFromFinish: boolean,

}


export type ElementParameters<
  T,
  A extends Actor = Actor
  > = {
    actor: A,
    infoTarget?: A,
    name?: string,
    layer?: string,
    settings?: Partial<T & ElementSettings>,
    breakpoints?: Array<string>
  }


export default class Element<Settings extends KV = KV, A extends Actor = Actor> extends Module<Settings & ElementSettings, Scroll> {

  public readonly scene = {

    start: 0,
    finish: 0,
    length: 0,
    offset: 0,
    checkStart: 0,
    checkFinish: 0,

  }

  public readonly statuses = {

    captured: false,
    released: false,
    capturedFromStart: false,
    capturedFromFinish: false,
    releasedFromStart: false,
    releasedFromFinish: false,

  }

  public readonly actor: A
  public readonly infoTarget: A

  constructor(parameters: ElementParameters<Settings, A>) {

    super()

    this.actor = parameters.actor
    this.infoTarget = parameters.infoTarget || this.actor
    this.name = parameters.name || 'element'
    this.type = 'element'
    this.layer = parameters?.layer || 'scroll'

    this.useConfiguration({

      length: types.number(1, { range: [0, 100] }),
      offset: types.number(1, { range: [-5, 5] }),
      cut: types.number(0, { range: [0, 1] }),
      checkLength: types.number(2, { range: [1, 100] }),

      ...(parameters.settings as Settings & Partial<ElementSettings>)

    }, parameters.breakpoints)

  }


  public onLaunch() {

    this.actor.on()

  }


  public onReset() {

    this.resetStatuses()
    this.actor.off()

  }


  public onSettingsChange(current: ElementSettings, previous: ElementSettings) {

    if (
      current.length !== previous.length ||
      current.offset !== previous.offset ||
      current.cut !== previous.cut
    ) {

      this.onAfterResize()

    }

  }


  public onAfterResize() {

    this.actor.resize()

    this.calculateSceneOffset()
    this.calculateSceneStart()
    this.calculateSceneLength()
    this.calculateSceneFinish()
    this.calculateSceneCheckLength()

    this.tick()

  }


  protected resetStatuses() {

    this.statuses.captured = false
    this.statuses.released = false
    this.statuses.capturedFromStart = false
    this.statuses.capturedFromFinish = false
    this.statuses.releasedFromStart = false
    this.statuses.releasedFromFinish = false

  }


  protected calculateSceneOffset() {

    this.scene.offset =
      this.parent!.size.viewport
      * this.configuration!.value.offset

  }


  protected calculateSceneStart() {

    this.scene.start = this.actor.position[this.parent!.configuration!.value.axis]
      - this.parent!.size.viewport
      + this.scene.offset

  }


  protected calculateSceneLength() {

    this.scene.length = this.configuration!.value.length
      ? this.configuration!.value.length
      * this.parent!.size.viewport
      - this.configuration!.value.cut * this.parent!.size.viewport
      + this.actor.size[this.parent!.configuration!.value.axis]
      : this.actor.size[this.parent!.configuration!.value.axis]
      - this.configuration!.value.cut * this.parent!.size.viewport

  }


  protected calculateSceneCheckLength() {

    this.scene.checkStart = this.scene.start - this.configuration!.value.checkLength * this.parent!.size.viewport
    this.scene.checkFinish = this.scene.finish + this.configuration!.value.checkLength * this.parent!.size.viewport

  }


  protected calculateSceneFinish() {

    this.scene.finish = this.scene.start + this.scene.length

  }


  public onTick() {

    const value = this.parent!.track.progress.lerp

    if (
      this.parent!.track.isIdle() ||
      value < this.scene.checkStart || value > this.scene.checkFinish
    ) return;

    this.tick()

  }


  public tick() {

    // capture / release

    const value = this.parent!.track.progress.lerp

    if (value >= this.scene.start && value <= this.scene.finish) {

      if (!this.statuses.captured) {

        this.capture()

      }

    } else if (this.statuses.captured) {

      this.release()

    }


    // capture / release ><

    if (value >= this.scene.start) {

      if (!this.statuses.capturedFromStart) {

        this.captureFromStart()

      }

    } else {

      if (this.statuses.capturedFromStart && !this.statuses.releasedFromStart) {

        this.releaseFromStart()

      }

    }


    // capture / release <>

    if (value <= this.scene.finish) {

      if (this.statuses.releasedFromFinish && !this.statuses.capturedFromFinish) {

        this.captureFromFinish()

      }

    } else {

      if (this.statuses.capturedFromStart && !this.statuses.releasedFromFinish) {

        this.releaseFromFinish()

      }

    }

  }


  protected capture() {

    this.statuses.captured = true
    this.statuses.released = false

    this.actor.receiveEvent('capture')

  }


  protected release() {

    this.statuses.released = true
    this.statuses.captured = false

    this.actor.receiveEvent('release')

  }


  protected captureFromStart() {

    this.statuses.capturedFromStart = true
    this.statuses.releasedFromStart = false

    this.actor.receiveEvent('captureFromStart')

  }


  protected captureFromFinish() {

    this.statuses.capturedFromFinish = true
    this.statuses.releasedFromFinish = false

    this.actor.receiveEvent('captureFromFinish')

  }


  protected releaseFromStart() {

    this.statuses.releasedFromStart = true
    this.statuses.capturedFromStart = false

    this.actor.receiveEvent('releaseFromStart')

  }


  protected releaseFromFinish() {

    this.statuses.releasedFromFinish = true
    this.statuses.capturedFromFinish = false

    this.actor.receiveEvent('releaseFromFinish')

  }

}