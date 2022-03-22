export default function screenFOV(screenHeight: number, cameraDistance: number) {

  return 2 * Math.atan((screenHeight / 2) / cameraDistance) * (180 / Math.PI)

}