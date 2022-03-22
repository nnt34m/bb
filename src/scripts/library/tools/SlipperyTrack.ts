import lerp from 'library:utils/math/lerp'
import Track, { TrackProgressType, TrackProgress } from './Track'

export type SlipperyTrackProgressType = TrackProgressType | 'lerp' | 'nole'
export type SlipperyTrackProgress = TrackProgress & { lerp: number, nole: number, speed: number }

export default class SlipperyTrack extends Track {

  progress: SlipperyTrackProgress = { exct: 0, norm: 0, lerp: 0, nole: 0, speed: 0 }

  constructor(public ease = 0.1) {

    super()

  }


  public slide() {

    this.progress.lerp = +lerp(this.progress.lerp, this.progress.exct, this.ease).toFixed(5)
    this.progress.nole = +(this.progress.lerp / this.length).toFixed(5) || 0

    const rush = Math.min(Math.abs(this.progress.exct - this.progress.lerp), 500) / 500
    this.progress.speed += (rush - this.progress.speed) * 0.05
    this.progress.speed = +this.progress.speed.toFixed(5)

  }


  public move(t: number) {

    this.set(t)
    this.slide()

  }


  public equalize() {

    this.progress.lerp = this.progress.exct
    this.progress.nole = this.progress.norm

  }


  public isIdle() {

    return this.progress.nole === this.progress.norm

  }

}