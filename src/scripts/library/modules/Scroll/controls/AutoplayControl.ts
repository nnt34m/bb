import { types } from "@theatre/core"
import Module from "library:modules/Module"
import Scroll from ".."

export type AutoplayControlSettings = {

  speed: number,
  await: number

}


export default class AutoplayControl extends Module<AutoplayControlSettings, Scroll> {

  private active = false
  private timeoutID = -1
  private prevTime = 0

  constructor(parameters?: { layer?: string, settings?: Partial<AutoplayControlSettings>, breakpoints?: Array<string> }) {

    super()

    this.name = 'autoplay'
    this.type = 'control'
    this.layer = parameters?.layer || 'scroll'

    this.useConfiguration({

      speed: types.number(0.001, { range: [0, 1] }),
      await: 4000,
      ...parameters?.settings

    }, parameters?.breakpoints)

  }


  public onLaunch() {

    this.parent!.actor.listen('mousedown keydown wheel touchstart', this.await)
    this.await()

  }


  public onReset() {

    this.parent!.actor.unlisten('mousedown keydown wheel touchstart', this.await)
    clearTimeout(this.timeoutID)

  }


  private await = () => {

    this.active = false

    clearTimeout(this.timeoutID)

    this.timeoutID = setTimeout(() => {

      this.active = true
      this.prevTime = Date.now()

    }, this.configuration!.value.await)

  }


  public onTick() {

    const t = Date.now() - this.prevTime

    if (this.active) {
      this.parent!.addForce(t * this.configuration!.value.speed)
    }

    this.prevTime = Date.now()

  }


}