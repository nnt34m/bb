export default function cumulativeLeft(htmlElement: HTMLElement, htmlElementExcept?: HTMLElement) {

  let left = 0

  do {

    left += htmlElement.offsetLeft || 0
    htmlElement = htmlElement.offsetParent as HTMLElement

  } while (htmlElement && htmlElement !== htmlElementExcept)

  return left

}