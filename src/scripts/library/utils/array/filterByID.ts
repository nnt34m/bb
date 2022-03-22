export default function filterByID<T extends { [key: string]: any, id: any }>(array: Array<T>, element: T) {

  return array.filter(value => value.id !== element.id)

}