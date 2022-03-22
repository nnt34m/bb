import { types } from "@theatre/core";
import Module from "library:modules/Module";
import Actor from "library:tools/ComplexActor";
import transit from "library:utils/animation/transit";
import easings from "library:utils/math/easings";
import Scroll from "..";

export type NavigatorControlSettings = {

  easing: keyof typeof easings.functions,
  duration: number,
  instant: boolean,
  offset: number,

}


export default class NavigatorControl extends Module<NavigatorControlSettings, Scroll> {

  actor: Actor
  targetActor: Actor
  offsetActor?: Actor

  constructor(parameters: {
    actor: Actor,
    targetActor: Actor,
    offsetActor?: Actor,
    layer?: string,
    name?: string,
    settings?: Partial<NavigatorControlSettings>,
    breakpoints?: Array<string>
  }) {

    super()

    this.actor = parameters.actor
    this.targetActor = parameters.targetActor
    this.offsetActor = parameters.offsetActor

    this.name = parameters.name || 'navigator'
    this.type = 'control'
    this.layer = parameters?.layer || 'scroll'

    this.useConfiguration({

      easing: types.stringLiteral('easeInOutExpo', easings.keys),
      duration: 1000,
      instant: false,
      offset: types.number(0, { range: [-2, 2] }),

      ...parameters?.settings

    }, parameters?.breakpoints)

  }


  public onLaunch() {

    this.actor.on()
    this.actor.listen('click', this.onClick)

  }


  public onReset() {

    this.actor.off()
    this.actor.unlisten('click')

  }


  public onResize() {

    this.offsetActor?.resize()
    this.targetActor?.resize()

  }


  private onClick = () => {

    if (this.configuration!.value.instant) {

      this.parent!.addForce(this.getDestination(), true)
      this.parent!.equalize()

    } else {

      transit(

        (t: number) => {
          this.parent!.setValue(t, true)
        },

        {
          duration: this.configuration!.value.duration,
          easing: this.configuration!.value.easing,
          stopEvents: 'mousedown wheel touchstart keydown',
          from: this.parent!.track.progress.exct,
          destination: this.getDestination()
        }

      )

    }

  }


  private getDestination() {

    let destination = this.targetActor.position[this.parent!.configuration!.value.axis]

    if (this.offsetActor) {

      destination += this.offsetActor.position[this.parent!.configuration!.value.axis]

    }

    destination += this.configuration!.value.offset * this.parent!.size.viewport

    return destination - this.parent!.track.progress.exct

  }

}