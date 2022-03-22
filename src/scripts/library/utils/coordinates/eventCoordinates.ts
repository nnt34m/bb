
export default function eventCoordinates(event: MouseEvent | TouchEvent): { isT: boolean, x: number, y: number } {

  let isT = false
  let x = 0
  let y = 0


  if (window.TouchEvent && event instanceof window.TouchEvent) {

    //@ts-ignore
    x = event.touches[0].clientX
    //@ts-ignore
    y = event.touches[0].clientY

    isT = true

  } else {

    x = (event as MouseEvent).clientX
    y = (event as MouseEvent).clientY

  }

  return { isT, x, y }

}
