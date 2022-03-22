import sizeWithMargins from './sizeWithMargins'

export default function widthWithMargins(htmlElement: HTMLElement) {

  return sizeWithMargins(htmlElement, 'x', 'left', 'right')

}