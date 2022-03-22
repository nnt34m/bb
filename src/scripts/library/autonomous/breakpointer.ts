export type BreakpointerCallback = (newBreakpoint: string, oldBreakpoint: string) => void


class User {

  public previousBreakpoint = ''

  constructor(
    public readonly callback: BreakpointerCallback,
    public readonly breakpoints: Array<string>
  ) { }

  public resize() {

    let matchedBreakpoint: string = ''

    this.breakpoints.forEach(breakpoint => {
      if (matchMedia(`(${breakpoint})`).matches) {
        matchedBreakpoint = breakpoint
      }
    })


    if (matchedBreakpoint !== this.previousBreakpoint) {

      this.callback(matchedBreakpoint, this.previousBreakpoint)

    }

    this.previousBreakpoint = matchedBreakpoint

  }

}


export class Breakpointer {

  private users: Map<BreakpointerCallback, User> = new Map()

  constructor() {

    addEventListener('resize', this.resize)

  }

  public resize = () => {

    this.users.forEach((value) => value.resize())

  }


  public add(callback: BreakpointerCallback, breakpoints: Array<string>, invokeImmediately = false) {

    if (!breakpoints.find(value => value === 'min-width: 0px')) {
      breakpoints.unshift('min-width: 0px')
    }

    const user = new User(callback, breakpoints)
    this.users.set(callback, user)

    if (invokeImmediately) user.resize()

  }


  public remove(callback: BreakpointerCallback) {

    this.users.delete(callback)

  }

}


const breakpointer = new Breakpointer()
export default breakpointer