import on from "../dom/on";
import easings from "../math/easings";

export default function transit(
  callback: Function,
  settings?: { duration?: number, easing?: keyof typeof easings.functions, stopEvents?: string, destination?: number, from?: number }
) {

  settings = settings || {}
  settings.duration = settings.duration || 1000
  settings.easing = settings.easing || 'easeInOutExpo'
  settings.stopEvents = settings.stopEvents || ''
  settings.destination = settings.destination || 1
  settings.from = settings.from || 0


  let frameID = -1

  const stop = () => {

    cancelAnimationFrame(frameID)
    removeListeners()

  }


  const tick = () => {

    frameID = requestAnimationFrame(tick)

    let t = (Date.now() - startTime) / 1000 / (settings!.duration! / 1000)
    const eased = easings.functions[settings!.easing!](t)

    if (t >= 1) {

      callback(settings!.from! + 1 * settings!.destination!)
      stop()
      return;

    }

    callback(settings!.from! + eased * settings!.destination!)

  }

  const removeListeners = on(document.body, settings.stopEvents, stop)
  const startTime = Date.now()

  frameID = requestAnimationFrame(tick)

}