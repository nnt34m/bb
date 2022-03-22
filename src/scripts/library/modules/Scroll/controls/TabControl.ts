import { types } from "@theatre/core"
import Module from "library:modules/Module"
import Actor from "library:tools/ComplexActor"
import transit from "library:utils/animation/transit"
import easings from "library:utils/math/easings"
import TabbingControl from "./TabbingControl"

export type TabControlSettings = {

  easing: keyof typeof easings,
  duration: number,
  instant: boolean,
  offset: number,
  index: number,
  preventScroll: boolean

}

export default class TabControl extends Module<TabControlSettings, TabbingControl> {

  public readonly actor: Actor

  constructor(parameters: {
    actor: Actor,
    layer?: string,
    name?: string,
    settings?: Partial<TabControlSettings>,
    breakpoints?: Array<string>
  }) {

    super()

    this.actor = parameters.actor
    this.name = parameters.name || 'tab'
    this.type = 'control'
    this.layer = parameters.layer || 'scroll'

    this.useConfiguration({

      easing: types.stringLiteral('easeInOutExpo', easings.keys),
      duration: 500,
      instant: false,
      offset: types.number(0, { range: [-2, 2] }),
      preventScroll: false,
      index: 0,

      ...parameters.settings

    }, parameters.breakpoints)

  }


  public onLaunch() {

    this.actor.on()

  }


  public onReset() {

    this.actor.off()

  }


  public onResize() {

    this.actor.resize()

  }


  public onSettingsChange(current: TabControlSettings, previous: TabControlSettings) {

    if (current.index !== previous.index) {

      this.parent!.onAfterLaunch()

    }

  }


  public bringIntoSight() {

    if (this.configuration!.value.instant) {

      this.parent!.parent!.setValue(this.getDestination(), true)
      this.parent!.parent!.equalize()

    } else {


      transit(

        (t: number) => this.parent!.parent!.setValue(t, true),

        {
          duration: this.configuration!.value.duration,
          easing: this.configuration!.value.easing as any,
          stopEvents: 'mousedown wheel touchstart keydown',
          from: this.parent!.parent!.track.progress.exct,
          destination: this.getDestination()
        }

      )

    }


  }


  public focus() {

    this.actor.focus({ preventScroll: true })

  }


  protected getDestination() {

    let destination = this.actor.position[this.parent!.parent!.configuration!.value.axis]
    destination += this.configuration!.value.offset * this.parent!.parent!.size.viewport
    return destination - this.parent!.parent!.track.progress.exct

  }

}