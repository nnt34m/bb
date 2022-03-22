import splitTrimFilter from '../string/splitTrimFilter'

export default function listenEvents(htmlElement: HTMLElement, events: string, callback: EventListener, options = {}) {

  const remove = splitTrimFilter(events, ' ').map(event => {

    htmlElement.addEventListener(event, callback, options)

    return () => htmlElement.removeEventListener(event, callback, options)

  })

  return () => remove.forEach(cb => cb())

}
