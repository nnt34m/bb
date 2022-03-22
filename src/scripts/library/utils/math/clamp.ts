export default function clamp(value: number, max = 1, min = 0) {

  return Math.max(min, Math.min(value, max))

}