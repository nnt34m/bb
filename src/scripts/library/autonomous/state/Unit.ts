import { ISheetObject, types } from "@theatre/core";
import Subscription from "library:tools/Subscription";
import { KV } from "library:types";
import Layer from "./Layer";

export type UnitParameters<T> = {
  unitName: string,
  settings: T,
}

export type SubscriptionCallback = <T>(currentValues: T, previousValues: T) => void

export default class Unit<T extends KV = {}> {

  private subscription = new Subscription('valuesChange')
  public readonly theatreObject: ISheetObject<T>
  public currentValues: T = {} as T
  public previousValues: T = {} as T
  private _unsubscribe: Array<Function> = []

  constructor(readonly parameters: UnitParameters<T> & { layer: Layer }) {

    this.theatreObject = this.parameters.layer.theatreSheet.object(
      parameters.unitName,
      parameters.settings as T
    )

  }


  public subscribe(callback: SubscriptionCallback) {

    this.subscription.subscribe('valuesChange', callback)

    if (this.subscription.subscribers > 0) {
      this._unsubscribe.push(this.theatreObject.onValuesChange(this.onValuesChange))
    }

  }


  public unsubscribe(callback: SubscriptionCallback) {

    this.subscription.unsubscribe('valuesChange', callback)

    if (this.subscription.subscribers === 0) {
      this._unsubscribe = this._unsubscribe.filter(value => {
        if (value === callback) value()
        else return true
      })
    }

  }


  private onValuesChange = (values: KV) => {

    // @ts-ignore
    this.currentValues = values as T

    this.subscription.notifySubscribers('valuesChange', this.currentValues, this.previousValues)

    // @ts-ignore
    this.previousValues = this.currentValues as T

  }


  public play() {

    this.theatreObject.sheet.sequence.play()

  }


  public pause() {

    this.theatreObject.sheet.sequence.pause()

  }


  public stop() {

    this.pause()
    this.theatreObject.sheet.sequence.position = 0

  }

}