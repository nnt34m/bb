export default function randomId() {

  return Date.now().toString(36) + Math.random().toString(36).substring(2)

}