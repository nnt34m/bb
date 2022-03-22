import { types } from "@theatre/core";
import Module from "library:modules/Module";
import ABTransition from "library:tools/ABTransition";
import easings from "library:utils/math/easings";

export type RouteTransitionSettings = {

  duration: number,
  easing: keyof typeof easings.functions

}


export type RouteSettings = {

  duration?: number,
  easing?: keyof typeof easings.functions
  transitionIn: RouteTransitionSettings,
  transitionOut: RouteTransitionSettings,
  history: boolean

}


export default class Route extends Module<RouteSettings> {

  public html?: HTMLElement

  public lang: string = document.documentElement.lang
  public href: string = ''
  public nextRouteName: string = ''
  public __href: string = ''
  public __name: string = ''

  public transitionRunning = false
  public collected = false
  public contentSelector: string

  private transitionIn: ABTransition | null = null
  private transitionOut: ABTransition | null = null

  private resolveActivation?: Function
  private rejectActivation?: Function
  private resolveDeactivation?: Function
  private rejectDeactivation?: Function

  public settings: RouteSettings

  public onInTransitonStart?(): void
  public onInTransitonProgress?(t: number): void
  public onInTransitonEnd?(): void
  public onOutTransitonStart?(): void
  public onOutTransitonProgress?(t: number): void
  public onOutTransitonEnd?(): void

  constructor(parameters: { name: string, contentSelector?: string, settings?: Partial<RouteSettings> }) {

    super()

    this.name = parameters.name
    this.layer = 'router'
    this.type = 'route'
    this.contentSelector = parameters.contentSelector || '.content'

    this.settings = {

      transitionIn: {
        duration: parameters.settings?.duration || 0,
        easing: parameters.settings?.easing || 'easeInCubic',
      },

      transitionOut: {
        duration: parameters.settings?.duration || 0,
        easing: parameters.settings?.easing || 'easeInCubic',
      },

      history: true,

      ...parameters.settings

    }


  }


  public bringIn() {

    if (this.settings.transitionIn.duration) {

      this.transitionIn = new ABTransition({
        duration: this.settings.transitionIn.duration,
        easing: this.settings.transitionIn.easing,
        handleStart: this.inTransitionStart,
        handleProgress: this.inTransitionProgress,
        handleEnd: this.inTransitionEnd,
      })

      this.transitionRunning = true
      this.transitionIn.start()

      return new Promise((resolve, reject) => {

        this.resolveActivation = resolve
        this.rejectActivation = reject

      })

    }

  }


  public bringOut() {

    if (this.settings.transitionOut.duration) {

      this.transitionOut = new ABTransition({
        duration: this.settings.transitionOut.duration,
        easing: this.settings.transitionOut.easing,
        handleStart: this.outTransitionStart,
        handleProgress: this.outTransitionProgress,
        handleEnd: this.outTransitionEnd,
      })

      this.transitionRunning = true
      this.transitionOut.start()

      return new Promise((resolve, reject) => {

        this.resolveDeactivation = resolve
        this.rejectDeactivation = reject

      })

    }

  }


  public breakTransition() {

    if (this.transitionOut) {

      this.transitionOut.brake()
      this.rejectDeactivation?.('the transition was stopped manually.')


    }

    if (this.transitionIn) {

      this.transitionIn.brake()
      this.rejectActivation?.('the transition was stopped manually.')


    }

    this.transitionRunning = false

  }


  private inTransitionStart = () => {

    this.onInTransitonStart?.()

  }


  private inTransitionProgress = (t: number) => {

    this.onInTransitonProgress?.(t)

  }


  private inTransitionEnd = () => {

    this.resolveActivation?.(true)
    this.transitionRunning = false

    this.onInTransitonEnd?.()

  }


  private outTransitionStart = () => {

    this.onOutTransitonStart?.()

  }


  private outTransitionProgress = (t: number) => {

    this.onOutTransitonProgress?.(t)

  }


  private outTransitionEnd = () => {

    this.resolveDeactivation?.(true)
    this.transitionRunning = false
    this.onOutTransitonEnd?.()

  }

}