export default function sizeWithMargins(htmlElement: HTMLElement, axis = 'y', ...sides: string[]) {

  const axisValue = htmlElement.getBoundingClientRect()[axis === 'y' ? 'height' : 'width']
  const css = window.getComputedStyle(htmlElement)

  const margins = sides.map((side: string) => {

    const propName = 'margin-' + side
    return parseInt(css.getPropertyValue(propName))

  }, 10)

  const total = margins.reduce((total: number, side: number) => total + side, axisValue)

  return total

}