import { types } from "@theatre/core"
import { ModuleSettings } from "library:modules/Module"
import ComplexActor from "library:tools/ComplexActor"
import { KV } from "library:types"
import Element, { ElementParameters, ElementSettings } from "./Element"

export type EffectElementType = 'class' | 'data' | 'native' | 'variable' | 'style'

export type EffectElementSettings = {

  type: EffectElementType
  property: string
  capture: string
  beforeCapture: string
  afterCapture: string
  permanent: boolean
  keep: boolean

}


export default class EffectElement<Settings extends KV = KV> extends Element<Settings & EffectElementSettings, ComplexActor> {

  public readonly statuses = {

    captured: false,
    released: false,
    capturedFromStart: false,
    capturedFromFinish: false,
    releasedFromStart: false,
    releasedFromFinish: false,
    keep: false,
    permanent: false

  }

  constructor(parameters: ElementParameters<Settings & EffectElementSettings, ComplexActor>) {

    super({

      name: 'effect',
      ...parameters,
      //@ts-ignore
      settings: {
        type: types.stringLiteral('class', { class: 'class', data: 'data', native: 'native', variable: 'variable', style: 'style' }),
        property: '',
        capture: 'capture',
        beforeCapture: '',
        afterCapture: '',
        permanent: false,
        keep: false,

        ...parameters.settings
      }
    })

  }


  public onLaunch() {

    super.onLaunch()

    if (

      (this.statuses.keep || this.statuses.permanent)
      && this.parent!.track.progress.lerp > this.scene.finish

    ) {

      this.capture()

    }

  }


  public onSettingsChange(
    current: Settings & ElementSettings & EffectElementSettings & ModuleSettings,
    previous: Settings & ElementSettings & EffectElementSettings & ModuleSettings
  ) {

    super.onSettingsChange(current, previous)

    if (
      current.type !== previous.type ||
      current.property !== previous.property ||
      current.capture !== previous.capture ||
      current.beforeCapture !== previous.beforeCapture ||
      current.afterCapture !== previous.afterCapture ||
      current.permanent !== previous.permanent ||
      current.keep !== previous.keep
    ) {

      this.resetStatuses()
      this.resetData(previous)
      this.tick()

    }

  }


  public onReset() {

    super.onReset()
    this.resetData()

  }


  protected resetData(configuration = this.configuration!.value) {

    if (configuration.type === 'class') {

      this.infoTarget.removeData('class', configuration.capture)
      this.infoTarget.removeData('class', configuration.beforeCapture)
      this.infoTarget.removeData('class', configuration.afterCapture)

    }

    else if (configuration.type === 'data') {

      this.infoTarget.removeData('custom', configuration.property)

    }

    else if (configuration.type === 'native') {

      this.infoTarget.removeData('native', configuration.property)

    }

    else if (configuration.type === 'variable') {

      this.infoTarget.removeData('variable', configuration.property)

    }

    else if (configuration.type === 'style') {

      this.infoTarget.removeData('style', configuration.property)

    }

  }


  protected resetStatuses() {

    super.resetStatuses()

    this.statuses.keep = false
    this.statuses.permanent = false

  }


  protected capture() {

    super.capture()

    this.toggle(

      this.configuration!.value.capture,
      this.configuration!.value.afterCapture,
      this.configuration!.value.beforeCapture,

    )

    if (this.configuration!.value.permanent) {

      this.statuses.permanent = true

    }

    if (this.configuration!.value.keep) {

      this.statuses.keep = true

    }

  }


  protected releaseFromStart() {

    super.releaseFromStart()

    if (this.statuses.permanent) return;

    this.toggle(

      this.configuration!.value.beforeCapture,
      this.configuration!.value.capture,
      this.configuration!.value.afterCapture,

    )

    this.statuses.keep = false

  }


  protected releaseFromFinish() {

    super.releaseFromFinish()

    if ((this.statuses.permanent || this.statuses.keep)) return;

    this.toggle(

      this.configuration!.value.afterCapture,
      this.configuration!.value.capture,
      this.configuration!.value.beforeCapture,

    )

  }


  protected toggle(a: string, b: string, c: string) {

    if (this.configuration!.value.type === 'class') {

      this.infoTarget.setData('class', a)
      this.infoTarget.removeData('class', b)
      this.infoTarget.removeData('class', c)

    }

    else if (this.configuration!.value.type === 'data') {

      this.infoTarget.setData('custom', this.configuration!.value.property, a)

    }

    else if (this.configuration!.value.type === 'native') {

      this.infoTarget.setData('native', this.configuration!.value.property, a)

    }

    else if (this.configuration!.value.type === 'variable') {

      this.infoTarget.setData('variable', this.configuration!.value.property, a)

    }

    else if (this.configuration!.value.type === 'style') {

      this.infoTarget.setData('style', this.configuration!.value.property, a)

    }

    this.actor.receiveEvent('toggle', {
      property: this.configuration!.value.type,
      capture: a,
      beforeCapture: b,
      afterCapture: c,
    })

  }

}