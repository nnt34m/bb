import { types } from "@theatre/core"
import Module from "library:modules/Module"
import Actor from "library:tools/ComplexActor"
import grab from "library:utils/events/grab"
import clamp from "library:utils/math/clamp"
import Scroll from ".."

export type ScrollbarControlSettings = {

  axis: 'x' | 'y',

}

export default class ScrollbarControl extends Module<ScrollbarControlSettings, Scroll> {

  private bar: Actor
  private knob: Actor
  private barScrollSize: number = 0

  constructor(parameters: { bar: Actor, knob: Actor, layer?: string, settings?: Partial<ScrollbarControlSettings>, breakpoints?: Array<string> }) {

    super()

    this.bar = parameters.bar
    this.knob = parameters.knob

    this.name = 'scrollbar'
    this.type = 'control'
    this.layer = parameters?.layer || 'scroll'

    this.useConfiguration({

      axis: types.stringLiteral('y', { y: 'y', x: 'x' }),
      ...parameters.settings

    })

  }


  public onLaunch() {

    this.bar.on()
    this.knob.on()

    this.knob.listen('mousedown touchstart', (event: Event) => {

      event.stopPropagation()


      grab(event as MouseEvent | TouchEvent, {

        axis: this.configuration!.value.axis,
        onMove: this.onMove,
        initialCoordinates: this.knob.translatedPosition

      })


    })

  }


  public onReset() {

    this.bar.off()
    this.knob.off()
    this.knob.unlisten('mousedown touchstart')

  }


  public onResize() {

    this.bar.resize()
    this.knob.resize()

    const axis = this.configuration!.value.axis
    this.barScrollSize = this.bar.size[axis] - this.knob.size[axis]

  }



  private onMove = (coord: { x: number, y: number, dx: number, dy: number }) => {

    const value = this.configuration!.value.axis === 'y' ? coord.y : coord.x
    const norm = clamp(value, this.barScrollSize) / this.barScrollSize

    this.parent!.setValueN(norm, true)

  }


  public onTick() {

    const translateValue = this.parent!.track.progress.nole * this.barScrollSize

    if (this.configuration!.value.axis === 'y') {

      this.knob.translate(0, translateValue)

    } else {

      this.knob.translate(translateValue, 0)

    }

  }

}