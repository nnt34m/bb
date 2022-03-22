export default class Subscription {

  public readonly events: Map<string, Array<Function>> = new Map()
  public readonly subscribers = 0

  constructor(...events: string[]) {

    events.forEach(event => this.events.set(event, []))

  }


  public showEvents() {

    Object.keys(this.events).forEach(key => console.log(key))

  }


  public addEvents(...eventNames: string[]) {

    eventNames.forEach(event => {

      if (!this.events.has(event)) {

        this.events.set(event, [])

      }

    })

  }


  public subscribe(event: string, callback: (...args: any) => void) {

    if (!this.events.has(event)) {
      throw new Error(`event "${event}" is not available.`)
    }

    //@ts-ignore
    this.subscribers += 1;

    (this.events.get(event) as Array<Function>).push(callback)

  }


  public unsubscribe(event: string, callback: (...args: any) => void) {


    if (!this.events.has(event)) {
      throw new Error(`event "${event}" is not available.`)
    }

    //@ts-ignore
    this.subscribers = Math.max(0, this.subscribers - 1)

    for (let i = (this.events.get(event) as Array<Function>).length - 1; i >= 0; i--) {

      const mcallback = (this.events.get(event) as Array<Function>)[i]
      if (mcallback === callback) (this.events.get(event) as Array<Function>).splice(i, 1)

    }

  }


  public notifySubscribers(event: string, ...args: any[]) {

    if (this.events.has(event)) {

      (this.events.get(event) as Array<Function>).forEach(callback => callback(...args))

    }

  }

}