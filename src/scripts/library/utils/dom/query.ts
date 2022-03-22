export function query(selector: string, callback: (element: HTMLElement, index: number, parent: Array<HTMLElement>) => void, noElementsCallback?: Function): Array<HTMLElement> {

  const elements = [...document.querySelectorAll(selector)]

  if (elements.length) {

    elements.forEach((element, i, parent) => {
      callback(element as HTMLElement, i, parent as Array<HTMLElement>)
    })

  } else {

    noElementsCallback?.()

  }


  return elements as Array<HTMLElement>

}