import Module from "library:modules/Module"
import Actor from "library:tools/ComplexActor"
import Scroll from ".."


export default abstract class Segment extends Module<{}, Scroll> {

  public readonly actor: Actor

  constructor(parameters: { actor: Actor }) {

    super()

    this.actor = parameters.actor
    this.name = 'segment'
    this.type = 'segment'
    this.autoTick = false

  }


  public onBeforeLaunch(res: Function, rej: Function) {

    if ((this.parent as Scroll).configuration?.value.type === 'default') {
      rej()
    } else {
      res()
    }

  }


  public onLaunch() {

    this.useResize()

  }


  public onReset() {

    this.actor.off()

  }


  public onResize() {

    this.actor.resize()

  }

}