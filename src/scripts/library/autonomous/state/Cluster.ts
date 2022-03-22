import breakpointer from "library:autonomous/breakpointer";
import Layer from "./Layer";
import Unit, { SubscriptionCallback } from "./Unit";
import Subscription from 'library:tools/Subscription'


export type ClusterParameters<T> = {
  clusterName: string,
  settings: T,
  breakpoints: Array<string>
}

export default class Cluster<T = {}> {

  public units: Map<string, Unit<T>> = new Map()
  public activeUnit?: Unit<T>
  public readonly subscription = new Subscription('valuesChange')
  public currentBreakpoint: string | null = null
  public subscribersCount = 0

  constructor(readonly parameters: ClusterParameters<T> & { layer: Layer }) {

    this.parameters.breakpoints.unshift('min-width: 0px')
    this.parameters.breakpoints.forEach(breakpoint => {

      this.units.set(breakpoint, new Unit({
        layer: this.parameters.layer,
        settings: this.parameters.settings,
        unitName: `${this.parameters.clusterName} (${breakpoint})`,
      }))

    })

  }


  public onBreakpointChange = (currentBreakpoint: string, previousBreakpoint: string) => {

    if (this.activeUnit) {

      this.subscription.events.forEach(event => {
        event.forEach(listener => {
          this.activeUnit!.unsubscribe(listener as SubscriptionCallback)
        })
      })

    }

    const previousUnit = this.activeUnit
    this.activeUnit = this.units.get(currentBreakpoint) as Unit<T>
    this.activeUnit.previousValues = previousUnit?.previousValues || {} as T

    this.subscription.events.forEach(event => {
      event.forEach(listener => {
        this.activeUnit!.subscribe(listener as SubscriptionCallback)
      })
    })

  }


  public subscribe(callback?: SubscriptionCallback) {

    if (callback) {
      this.subscription.subscribe('valuesChange', callback)
    }

    this.subscribersCount++

    if (this.subscribersCount > 0) {
      breakpointer.add(this.onBreakpointChange, this.parameters.breakpoints, true)
    }

  }


  public unsubscribe(callback?: SubscriptionCallback) {

    if (callback) {
      this.subscription.unsubscribe('valuesChange', callback)
    }

    this.subscribersCount--

    if (this.subscribersCount === 0) {
      breakpointer.remove(this.onBreakpointChange)
    }

  }


  public get value() {

    return this.activeUnit!.currentValues

  }


  public get previousValue() {

    return this.activeUnit!.previousValues

  }


  public play() {

    this.activeUnit?.play()

  }


  public pause() {

    this.activeUnit?.pause()

  }


  public stop() {

    this.activeUnit?.stop()

  }

}