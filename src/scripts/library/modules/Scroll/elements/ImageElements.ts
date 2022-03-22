import { types } from "@theatre/core"
import device from "library:autonomous/device"
import { ModuleSettings } from "library:modules/Module"
import ComplexActor from "library:tools/ComplexActor"
import HTMLActor from "library:tools/HTMLActor"
import { KV } from "library:types"
import splitTrimFilter from "library:utils/string/splitTrimFilter"
import Element, { ElementParameters, ElementSettings } from "./Element"

export type ImageElementSettings = {

  path: string
  x: string
  webp: boolean

}


export default class ImageElement<Settings extends KV = {}> extends Element<Settings & ImageElementSettings, ComplexActor> {

  public readonly statuses = {

    captured: false,
    released: false,
    capturedFromStart: false,
    capturedFromFinish: false,
    releasedFromStart: false,
    releasedFromFinish: false,
    loaded: false

  }


  public finalPath: string | null = null


  constructor(parameters: ElementParameters<Settings & ImageElementSettings, ComplexActor>) {

    super({

      name: 'image',
      ...parameters,
      //@ts-ignore
      settings: {

        length: types.number(0, { range: [-10, 10] }),
        offset: types.number(-1, { range: [-5, 5] }),

        path: '',
        x: '',
        webp: false,

        ...parameters.settings
      }
    })

  }


  public onLaunch() {

    super.onLaunch()
    this.prepareImage()

  }


  public onSettingsChange(
    current: ElementSettings & ImageElementSettings & ModuleSettings,
    previous: ElementSettings & ImageElementSettings & ModuleSettings
  ) {

    super.onSettingsChange(current, previous)

    if (
      current.path !== previous.path ||
      current.webp !== previous.webp ||
      current.x !== previous.x
    ) {

      this.removeImage()
      this.resetStatuses()
      this.prepareImage()
      this.tick()

    }

  }


  public onReset() {

    super.onReset()
    this.removeImage()

  }


  protected resetStatuses() {

    super.resetStatuses()

    this.statuses.loaded = false

  }


  protected captureFromStart() {

    super.captureFromStart()
    this.loadImage()

  }


  protected prepareImage() {

    if (!this.configuration!.value.path || (!this.configuration!.value.x && !this.configuration!.value.webp)) {
      return this.finalPath = this.configuration!.value.path
    }

    const extensionIndex = this.configuration!.value.path.lastIndexOf('.')
    const extension = this.configuration!.value.path.slice(extensionIndex + 1)
    let imageName = this.configuration!.value.path.slice(0, extensionIndex)


    if (this.configuration!.value.x) {

      const ratios = splitTrimFilter(this.configuration!.value.x, '|').map(r => +r)
      const matchRatio = ratios.find(r => r == device.pixelRatio)

      if (matchRatio) {

        imageName += '@' + matchRatio + 'x'

      } else {

        imageName += '@' + ratios[ratios.length - 1] + 'x'

      }

    }

    if (this.configuration!.value.webp && device.isWebp) {

      this.finalPath = `${imageName}.webp`

    } else {

      this.finalPath = `${imageName}.${extension}`

    }

  }


  protected loadImage() {

    if (this.statuses.loaded || !this.finalPath) return;

    else if (this.infoTarget instanceof HTMLActor) {

      if (this.infoTarget.body.tagName === 'IMG') {

        this.infoTarget.setData('native', 'src', this.finalPath)

      } else {

        this.infoTarget.setData('style', 'backgroundImage', `url(${this.finalPath})`)

      }

    } else {

      this.infoTarget.setData('native', 'src', this.finalPath)

    }

    this.statuses.loaded = true

    this.actor.receiveEvent('load', {
      target: this.infoTarget,
      src: this.finalPath
    })

  }


  protected removeImage() {

    this.statuses.loaded = false

    if (!this.infoTarget) return;


    else if (this.infoTarget instanceof HTMLActor) {

      if (this.infoTarget.body.tagName === 'IMG') {

        (this.infoTarget.body as HTMLImageElement).src = ''

      } else {

        this.infoTarget.body.style.backgroundImage = ''

      }

    } else {

      this.infoTarget.removeData('native', 'src')

    }


    this.actor.receiveEvent('unload', {
      target: this.infoTarget,
      src: this.finalPath
    })

  }

}