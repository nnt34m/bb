export default function isWebp() {

  const htmlElement = document.createElement('canvas')

  if (!!(htmlElement.getContext && htmlElement.getContext('2d'))) {

    return htmlElement.toDataURL('image/webp').indexOf('data:image/webp') == 0

  }

  return false

}
