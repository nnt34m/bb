import { types } from '@theatre/core'
import Module from 'library:modules/Module'
import eventCoordinates from 'library:utils/coordinates/eventCoordinates'
import Scroll from '..'

export type DragControlSettings = {

  mouse: boolean,
  acceleration: number,

}

export default class DragControl extends Module<DragControlSettings, Scroll> {

  constructor(parameters?: { layer?: string, settings?: Partial<DragControlSettings>, breakpoints?: Array<string> }) {

    super()

    this.name = 'drag'
    this.type = 'control'
    this.layer = parameters?.layer || 'scroll'

    this.useConfiguration({

      mouse: false,
      acceleration: types.number(0, { range: [0, 10] }),
      ...parameters?.settings

    }, parameters?.breakpoints)

  }


  public onSettingsChange() {


    if (this.configuration!.value.mouse) {

      this.parent!.actor.listen('mousedown', this.onGrab)

    } else {

      this.parent!.actor.unlisten('mousedown', this.onGrab)

    }

  }


  public onLaunch() {

    this.parent!.actor.listen('touchstart', this.onGrab)

    if (this.configuration!.value.mouse) {

      this.parent!.actor.listen('mousedown', this.onGrab)

    }

  }


  public onReset() {

    this.parent!.actor.unlisten('mousedown touchstart')

  }


  private onGrab = (event: Event) => {

    if (this.parent!.checkIfInDeadZone(event.target as HTMLElement)) return

    event.stopPropagation()

    if ((event?.target as HTMLElement).tagName === 'IMG') event.preventDefault()

    const move = (event: Event) => {

      if (event.cancelable) event.preventDefault()

      const { x: currentX, y: currentY } = eventCoordinates(event as MouseEvent | TouchEvent)

      const dx = startX - currentX
      const dy = startY - currentY

      const max = Math.abs(dx) > Math.abs(dy) ? dx : dy
      const sign = Math.sign(max)
      const delta = Math.sqrt(dx * dx + dy * dy) * sign
      const diff = Math.abs(delta) / this.parent!.size.viewport
      const acceleration = 1 + (diff * this.configuration!.value.acceleration)
      const value = startScrollValue + delta * acceleration

      this.parent!.setValue(value, true)

    }

    const end = () => {
      this.parent!.actor.unlisten('mousemove touchmove mouseup touchend')
      document.documentElement.classList.remove('grabbing')
    }

    const startScrollValue = this.parent!.track.progress.exct

    const { x: startX, y: startY } = eventCoordinates(event as MouseEvent | TouchEvent)

    this.parent!.actor.listen('mousemove touchmove', move, { passive: false })
    this.parent!.actor.listen('mouseup touchend', end)

    document.documentElement.classList.add('grabbing')

  }

}