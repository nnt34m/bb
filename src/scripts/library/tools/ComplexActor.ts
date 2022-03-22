import { KV } from "library:types"
import Actor from "./Actor"

export type DataTypes = 'class' | 'custom' | 'native' | 'variable' | 'style'
export type Listeners = Map<string, Array<Function>>

export default abstract class ComplexActor extends Actor {

  protected listeners: Listeners = new Map()
  public readonly transformation = [1, 0, 0, 1, 0, 0]

  constructor() {
    super()
  }

  public abstract focus(options: { preventScroll: boolean }): void
  public abstract blur(): void
  protected abstract transform(): void
  protected abstract addEventListener(event: string, callback: Function, ...options: Array<any>): void
  protected abstract removeEventListener(event: string, callback: Function): void
  public abstract removeData(type: DataTypes, name: string): void
  public abstract setData(type: DataTypes, name: string, value?: any): void
  public abstract getData(type: DataTypes, name: string): any

  public off() {

    this.transformation[0] = 1
    this.transformation[1] = 0
    this.transformation[2] = 0
    this.transformation[3] = 1
    this.transformation[4] = 0
    this.transformation[5] = 0

  }


  public listen(events: string, callback: Function, ...options: Array<KV>) {

    const eventsArray = events.split(' ')

    eventsArray.forEach(event => {

      if (this.listeners.has(event)) {

        const group = this.listeners.get(event) as Array<Function>
        group.push(callback)

      } else {

        this.listeners.set(event, [callback])

      }

      this.addEventListener(event, callback as EventListener, ...options)

    })

  }


  public unlisten(events: string, callback?: Function) {

    const eventsArray = events.split(' ')

    eventsArray.forEach(event => {

      if (this.listeners.has(event)) {

        let group = this.listeners.get(event) as Array<Function>

        if (callback) {

          group = group.filter(listener => {

            if (listener !== callback) {

              return true

            } else {

              this.removeEventListener(event, callback as EventListener)

            }

          })


        } else {

          group.forEach(listener => {

            this.removeEventListener(event, listener as EventListener)

          })

          this.listeners.delete(event)

        }

      }

    })

  }


  public unlistenAll() {

    this.listeners.forEach((group, event) => {

      group.forEach(listener => {

        this.removeEventListener(event, listener as EventListener)

      })

    })

    this.listeners.clear()

  }


  public scale(x: number, y: number) {

    this.transformation[0] = x
    this.transformation[3] = y

    this.transform()

  }


  public translate(x: number, y: number) {

    this.transformation[4] = x
    this.transformation[5] = y

    this.transform()

  }


  public get transformedPosition() {

    return {

      x: this.position.x + this.transformation[4],
      y: this.position.y + this.transformation[5]

    }

  }


  public get transformedSize() {

    return {

      x: this.size.x * this.transformation[0],
      y: this.size.y * this.transformation[3]

    }

  }


  public get translatedPosition() {
    return {
      x: this.transformation[4],
      y: this.transformation[5],
    }
  }


  public get translatedSize() {
    return {
      x: this.transformation[0],
      y: this.transformation[3],
    }
  }

}