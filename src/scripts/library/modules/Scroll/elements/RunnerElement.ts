import { types } from "@theatre/core"
import ComplexActor from "library:tools/ComplexActor"
import SlipperyTrack from "library:tools/SlipperyTrack"
import { KV } from "library:types"
import Element, { ElementParameters, ElementSettings } from "./Element"

export type RunnerElementVariableType = 'lerp' | 'exct' | 'nole' | 'norm'

export type RunnerElementSettings = {

  ease: number
  fractions: number
  variable: string
  variableType: RunnerElementVariableType

}

export default class RunnerElement<Settings extends KV = {}> extends Element<Settings & RunnerElementSettings, ComplexActor> {

  public track = new SlipperyTrack()
  public trackFractions: Array<SlipperyTrack> = []
  public trackCurrentFraction = 0
  public trackPreviousFraction = -1

  constructor(parameters: ElementParameters<Settings & RunnerElementSettings, ComplexActor>) {

    super({
      name: 'runer',
      ...parameters,
      //@ts-ignore
      settings: {

        ease: types.number(0, { range: [0, 0.2] }),
        fractions: types.number(0, {
          range: [0, 20], nudgeFn: (v): number => {
            return Math.floor(v.deltaFraction * 20)
          }
        }),
        variable: '',
        variableType: types.stringLiteral('nole', { lerp: 'lerp', exct: 'exct', nole: 'nole', norm: 'norm' }),

        ...parameters.settings

      }
    })


  }


  public onLaunch() {

    super.onLaunch()
    this.prepareTracks()

  }


  public onReset() {

    super.onReset()

    this.hideProgress()
    this.track.reset()
    this.trackFractions.forEach(fraction => fraction.reset())

  }


  public onAfterResize() {

    super.onAfterResize()

    this.track.parameters(0, this.scene.length, this.scene.start)

    if (this.configuration!.value.fractions) {

      this.resizeTrackFractions()

    }

  }


  public onSettingsChange(current: RunnerElementSettings & ElementSettings, previous: RunnerElementSettings & ElementSettings) {

    super.onSettingsChange(current, previous)

    if (
      current.fractions !== previous.fractions ||
      current.variable !== previous.variable
    ) {

      this.hideProgress()
      this.prepareTracks()
      this.tick()

    }

    if (current.ease !== previous.ease) {
      this.setEase()
    }

  }


  protected prepareTracks() {

    this.createTrackFractions()
    this.resizeTrackFractions()
    this.setEase()
    this.updateTrack(this.parent!.track.progress.exct)
    this.equalizeTracks()
    this.showProgress()

  }


  private setEase() {

    this.track.ease = this.configuration!.value.ease || this.parent!.configuration!.value.ease

  }


  public tick() {

    super.tick()

    this.updateTrack(this.parent!.track.progress.exct)
    this.calculateTrackCurrentFraction()
    this.showProgress()

  }


  protected updateTrack(value: number) {

    if (this.parent!.configuration!.value.type !== 'default') {

      this.track.move(value)
      this.trackFractions.forEach(fraction => fraction.move(value))

    } else {

      this.track.set(value)
      this.track.equalize()
      this.trackFractions.forEach(fraction => {
        fraction.set(value)
        fraction.equalize()
      })

    }

    this.actor.receiveEvent('track', {
      track: this.track,
      trackFractions: this.trackFractions,
    })

  }


  protected calculateTrackCurrentFraction() {

    if (this.configuration!.value.fractions) {

      this.trackCurrentFraction = Math.min(
        Math.floor(
          this.track.progress.exct / (this.track.length / this.configuration!.value.fractions)
        ),
        this.configuration!.value.fractions - 1
      )

    }

    if (this.trackCurrentFraction !== this.trackPreviousFraction) {

      this.actor.receiveEvent('trackCurrentFraction', {
        currentFraction: this.trackCurrentFraction,
        lastFraction: this.trackPreviousFraction,
      })

      this.trackPreviousFraction = this.trackCurrentFraction

    }

  }


  protected equalizeTracks() {

    this.track.equalize()
    this.trackFractions.forEach(fraction => fraction.equalize())

  }


  protected createTrackFractions() {

    this.trackFractions = []

    for (let i = 0; i < this.configuration!.value.fractions; i++) {

      this.trackFractions[i] = new SlipperyTrack(
        this.configuration!.value.ease || this.parent!.configuration!.value.ease || this.configuration!.value.ease
      )

    }

  }


  protected resizeTrackFractions() {

    const step = 1 / this.configuration!.value.fractions
    const length = this.scene.length * step

    for (let i = 0; i < this.configuration!.value.fractions; i++) {

      const start = this.scene.start + i * step * this.scene.length
      this.trackFractions[i].parameters(0, length, start)

    }

  }


  protected showProgress() {

    const variable = this.configuration!.value.variable

    if (variable) {

      this.showProgressHelper(this.track, variable)

      this.trackFractions.forEach((fraction, i) => {

        this.showProgressHelper(
          fraction,
          variable + '-' + (i + 1)
        )

      })

    }

  }


  protected showProgressHelper(track: SlipperyTrack, variable: string) {

    this.infoTarget.setData(
      'variable',
      variable,
      track.progress[this.configuration!.value.variableType].toString()
    )

  }


  protected hideProgress() {

    const variable = this.configuration!.value.variable || this.configuration!.previousValue.variable

    if (variable) {

      this.infoTarget.removeData('variable', variable)

      this.trackFractions.forEach((_, i) => {

        this.infoTarget.removeData('variable', variable + '-' + (i + 1))

      })

    }

  }

}