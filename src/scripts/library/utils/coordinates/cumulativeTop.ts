export default function cumulativeTop(htmlElement: HTMLElement, htmlElementExcept?: HTMLElement) {

  let top = 0

  do {

    top += htmlElement.offsetTop || 0
    htmlElement = htmlElement.offsetParent as HTMLElement

  } while (htmlElement && htmlElement !== htmlElementExcept)


  return top

}