import { types } from "@theatre/core";
import Module from "library:modules/Module";
import clamp from "library:utils/math/clamp";
import lerp from "library:utils/math/lerp";
import Scroll from "..";

export type WheelControlSettings = {

  type: 'smooth' | 'default',
  ease: number,
  speed: number,

}


export default class WheelControl extends Module<WheelControlSettings, Scroll> {

  public readonly value = {
    exct: 0,
    lerp: 0,
    delta: 0
  }

  constructor(parameters?: { layer?: string, settings?: Partial<WheelControlSettings>, breakpoints?: Array<string> }) {

    super()

    this.name = 'wheel'
    this.type = 'control'
    this.layer = parameters?.layer || 'scroll'
    this.autoTick = false

    this.useConfiguration({

      type: types.stringLiteral('smooth', { smooth: 'smooth', default: 'default' }),
      ease: types.number(0.1, { range: [0, 0.5] }),
      speed: types.number(1, { range: [0, 10] }),

      ...parameters?.settings

    }, parameters?.breakpoints)



  }


  public onLaunch() {

    this.parent!.actor.listen('wheel', this.onWheel)

  }


  public onReset() {

    this.parent!.actor.unlisten('wheel', this.onWheel)

  }


  protected onWheel = (event: WheelEvent) => {

    // if (this.parent!.checkIfInDeadZone(event.target as HTMLElement)) return

    const { type, speed } = this.configuration!.value

    if (type === 'default') {

      this.parent!.addForce(event.deltaY * speed)

    } else {

      this.useTick()
      this.value.delta = Math.abs(Math.min(event.deltaY, 100))
      this.value.exct = clamp(event.deltaY, 1, -1)

    }

  }


  public onTick() {

    const { ease, speed } = this.configuration!.value

    this.value.exct *= 0.7
    this.value.lerp = lerp(this.value.lerp, this.value.exct, ease)

    const value = Math.abs(this.value.lerp) * (this.value.delta * this.value.lerp)
      ; (this.parent as Scroll)!.addForce(value * speed)

    if (this.value.exct.toFixed(5) === this.value.lerp.toFixed(5)) {

      this.unuseTick()
      this.value.exct = this.value.lerp = 0

    }

  }

}