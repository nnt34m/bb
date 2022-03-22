import ticker from "library:autonomous/ticker";
import easings from "library:utils/math/easings";

export type ABTransitionSettings = {

  duration: number,
  easing: keyof typeof easings.functions,
  handleProgress?: Function,
  handleStart?: Function,
  handleEnd?: Function,

}

export default class ABTransition {

  readonly settings: ABTransitionSettings
  private startTime: number = 0

  constructor(settings: Partial<ABTransitionSettings> = {}) {

    this.settings = {

      duration: 1000,
      easing: 'easeInOutExpo',
      handleProgress: settings.handleProgress,
      handleStart: settings.handleStart,
      handleEnd: settings.handleEnd,

      ...settings

    }

  }


  public start() {

    this.startTime = Date.now()
    this.settings.handleStart?.()
    ticker.add(this.tick)

  }


  private stop() {

    ticker.remove(this.tick)
    this.settings.handleEnd?.()

  }


  public brake() {

    ticker.remove(this.tick)

  }


  private tick = () => {

    const t = (Date.now() - this.startTime) / 1000 / (this.settings.duration / 1000)
    const eased = easings.functions[this.settings.easing](t)

    if (t >= 1) {

      this.settings.handleProgress?.(1)
      this.stop()
      return

    }


    this.settings.handleProgress?.(eased)

  }

}