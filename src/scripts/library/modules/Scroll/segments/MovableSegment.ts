import Actor from "library:tools/ComplexActor"
import { XORY } from "library:types"
import Segment from "./Segment"


export default class MovableSegment extends Segment {

  constructor(parameters: { actor: Actor }) {

    super(parameters)

  }


  public onLaunch() {

    super.onLaunch()
    this.useTick(1)

  }


  public onAfterLaunch() {

    this.tick()

  }


  public onAfterResize() {

    this.tick()

  }


  public onReset() {

    super.onReset()
    this.unuseTick()

  }


  public onTick() {

    if (this.parent!.track.isIdle()) return;

    this.tick()

  }


  protected tick() {

    const progress = this.parent!.track.progress.lerp

    const axis = this.parent!.configuration!.value.axis
    const viewportSize = this.parent!.size.viewport

    const start = this.actor.position[axis]
    const finish = this.actor.position[axis] + this.actor.size[axis]
    const delta = progress - start

    let translate = 0

    if (progress > finish) {

      translate = finish

    } else if (progress > start - viewportSize) {

      translate = start + delta

    }

    this.translate(translate, axis)

  }


  public translate(value: number, axis: XORY) {

    if (axis === 'y') {

      this.actor.translate(0, -value)

    } else {

      this.actor.translate(-value, 0)

    }

  }

}