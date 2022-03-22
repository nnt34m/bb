import clamp from '../utils/math/clamp'

export type TrackProgressType = 'exct' | 'norm'
export type TrackProgress = { exct: number, norm: number, [key: string]: number }

export default class Track {

  readonly progress: TrackProgress = { exct: 0, norm: 0 }
  readonly start: number = 0
  readonly length: number = 0
  readonly offset: number = 0
  readonly cycle: number = 0


  public parameters(start = 0, length = 0, offset = 0) {

    // @ts-ignore
    this.start = start
    // @ts-ignore
    this.length = length
    // @ts-ignore
    this.offset = offset
    // @ts-ignore

  }


  public step(t: number) {

    this.set(this.progress.exct + t)

  }


  public set(t: number) {

    this.progress.exct = clamp(t - this.offset, this.length, this.start)
    this.progress.norm = +(this.progress.exct / this.length).toFixed(5) || 0

  }


  public setN(t: number) {

    this.set(t * this.length)

  }


  public reset() {

    for (const member in this.progress) {

      this.progress[member as TrackProgressType] = 0

    }

  }

}