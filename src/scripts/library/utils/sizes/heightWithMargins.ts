import sizeWithMargins from './sizeWithMargins'

export default function heightWithMargins(htmlElement: HTMLElement) {

  return sizeWithMargins(htmlElement, 'y', 'top', 'bottom')

}