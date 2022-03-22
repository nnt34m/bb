import Module from "library:modules/Module"
import easings from "library:utils/math/easings"
import Scroll from ".."

export type KeysControlSettings = {

  spaceForce: number,
  arrowsForce: number,

}


export default class KeysControl extends Module<KeysControlSettings, Scroll> {


  constructor(parameters?: { layer?: string, settings?: Partial<KeysControlSettings>, breakpoints?: Array<string> }) {

    super()

    this.name = 'keys'
    this.type = 'control'
    this.layer = parameters?.layer || 'scroll'

    this.useConfiguration({

      spaceForce: 200,
      arrowsForce: 100,
      ...parameters?.settings

    }, parameters?.breakpoints)

  }


  public onLaunch() {

    this.parent!.actor.listen('keydown', this.onKeydown)

  }


  public onReset() {

    this.parent!.actor.unlisten('keydown', this.onKeydown)

  }


  private onKeydown = (event: KeyboardEvent) => {

    const { spaceForce, arrowsForce } = this.configuration!.value

    if (event.key === ' ' && (!document.activeElement || document.activeElement === this.parent!.actor.body)) {

      if (event.shiftKey) this.parent!.addForce(-spaceForce)
      else this.parent!.addForce(spaceForce)

    }

    else if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'PageDown') {

      this.parent!.addForce(arrowsForce)

    }

    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'PageUp') {

      this.parent!.addForce(-arrowsForce)

    }

    else if (event.key === 'Home') {

      this.parent!.setValue(0)

    }

    else if (event.key === 'End') {

      this.parent!.setValue(this.parent!.size.page)

    }

  }

}