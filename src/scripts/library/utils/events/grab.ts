import eventCoordinates from "../coordinates/eventCoordinates";

export type MoveObject = { x: number, y: number, dx: number, dy: number }

export type GrabOptions = {

  initialCoordinates: { x: number, y: number }
  processXDelta: null | ((delta: number) => number)
  processYDelta: null | ((delta: number) => number)
  axis: 'x' | 'y' | 'xy' | null
  onMove: null | ((object: MoveObject) => void)
  onDrop: null | (() => void)

}


export default function grab(event: MouseEvent | TouchEvent, options: Partial<GrabOptions> = {}) {

  if (event.type !== 'touchstart' && event.type !== 'mousedown') return;

  options.initialCoordinates = options.initialCoordinates || { x: 0, y: 0 }
  options.processXDelta = options.processXDelta || null
  options.processYDelta = options.processYDelta || null
  options.onMove = options.onMove || null
  options.onDrop = options.onDrop || null
  options.axis = options.axis || null

  const listen = () => {

    if (grabCoordinates.isTouch) {

      document.documentElement.addEventListener('touchmove', move, { passive: false })
      document.documentElement.addEventListener('touchend', drop)

    } else {

      document.documentElement.addEventListener('mousemove', move)
      document.documentElement.addEventListener('mouseup', drop)

    }

  }

  const unlisten = () => {

    if (grabCoordinates.isTouch) {

      document.documentElement.removeEventListener('touchmove', move)
      document.documentElement.removeEventListener('touchend', drop)

    } else {

      document.documentElement.removeEventListener('mousemove', move)
      document.documentElement.removeEventListener('mouseup', drop)

    }

  }

  const move = (event: MouseEvent | TouchEvent) => {

    const moveCoordinates = eventCoordinates(event)

    let dx = 0, dy = 0

    if (options.processXDelta) {

      dx = options.processXDelta(moveCoordinates.x - grabCoordinates.x)

    } else {

      dx = (moveCoordinates.x - grabCoordinates.x)

    }


    if (options.processYDelta) {

      dy = options.processYDelta(moveCoordinates.y - grabCoordinates.y)

    } else {

      dy = (moveCoordinates.y - grabCoordinates.y)

    }

    const x = options.initialCoordinates!.x + dx
    const y = options.initialCoordinates!.y + dy

    if (!options.axis || options.axis === 'xy') {

      event.preventDefault()
      options?.onMove?.({ x, y, dx, dy })

    } else {

      const d = options.axis === 'x' ? dx : dy

      if (Math.abs(d) > 10 && event.cancelable) {

        event.preventDefault()
        options?.onMove?.({ x, y, dx, dy })

      }

    }

  }

  const drop = () => {

    document.documentElement.classList.remove('grabbing')
    unlisten()
    options?.onDrop?.()

  }

  const grabCoordinates = eventCoordinates(event)

  if (!grabCoordinates.isTouch) event.preventDefault()

  document.documentElement.classList.add('grabbing')
  listen()

}