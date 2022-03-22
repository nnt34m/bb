import Module from "library:modules/Module";
import Scroll from "..";


export default class DefaultControl extends Module<{}, Scroll> {

  constructor(parameters?: { layer?: string }) {

    super()

    this.name = 'default control'
    this.type = 'control'
    this.layer = parameters?.layer || 'scroll'

  }


  public onLaunch() {

    this.parent!.actor.listen('scroll', this.onScroll)

  }


  public onReset() {

    this.parent!.actor.unlisten('scroll')

  }


  private onScroll = () => {

    this.parent!.setValue(
      this.parent!.configuration!.value.axis === 'y'
        ? this.parent!.actor.body.scrollTop
        : this.parent!.actor.body.scrollLeft
    )

  }

}