export default function randomBounce(index: number, del: number = 2) {

  return index % del === 0 ? 1 : -1

}