import eachObjectMember from "library:utils/object/eachObjectMember"

const functions = {

  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number) => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 + (--t) * t * t * t * t,
  easeInOutQuint: (t: number) => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
  easeInExpo: (t: number) => t === 0 ? 0 : 2 ** (10 * (t - 1)),
  easeOutExpo: (t: number) => t === 1 ? 1 : 1 - 2 ** (-10 * t),
  easeInOutExpo: (t: number) => t === 0 || t === 1 ? t : t < 0.5 ? 0.5 * (2 ** (10 * 2 * (t - 0.5))) : 0.5 * (2 - Math.abs(2 ** (-10 * 2 * (t - 0.5))))

}

const keys: { [key: string]: any } = {}
eachObjectMember(functions, (_, memberName) => keys[memberName] = memberName)

export default {
  functions,
  keys
}