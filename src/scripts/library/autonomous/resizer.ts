import debounce from "library:utils/delay/debounce"

export class Resizer {

  private before: Set<Function> = new Set()
  private after: Set<Function> = new Set()
  private needToResizeBefore: Set<Function> = new Set()
  private needToResizeAfter: Set<Function> = new Set()
  private needToResizeTimeoutId = -1


  constructor() {

    addEventListener('resize', debounce(this.resize))

  }


  public resize = () => {

    this.before.forEach(callback => callback())
    this.after.forEach(callback => callback())

  }


  public add(callback: Function, order: 'before' | 'after' = 'before', invokeImmediately = false) {

    if (this[order].has(callback)) return;

    this[order].add(callback)

    if (invokeImmediately) callback()

  }


  public remove(callback: Function, order: 'before' | 'after' = 'before') {

    this[order].delete(callback)

  }


  public markToResize(callback: Function, order: 'before' | 'after' = 'before') {

    if (order === 'before') {
      this.needToResizeBefore.add(callback)
    } else {
      this.needToResizeAfter.add(callback)
    }

    clearTimeout(this.needToResizeTimeoutId)

    this.needToResizeTimeoutId = setTimeout(() => {

      this.needToResizeBefore.forEach(callback => {
        callback()
      })

      this.needToResizeAfter.forEach(callback => {
        callback()
      })

      this.needToResizeBefore.clear()
      this.needToResizeAfter.clear()

    }, 0)

  }


  public unmarkToResize(callback: Function, order: 'before' | 'after' = 'before') {

    if (order === 'before') {
      this.needToResizeBefore.delete(callback)
    } else {
      this.needToResizeAfter.delete(callback)
    }

  }

}


const resizer = new Resizer()
export default resizer