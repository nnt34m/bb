export default function eachObjectMember<T extends { [key: string]: any }>(object: T, callback: (value: any, property: keyof T, parent: T) => void) {

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {

      const element = object[key]
      callback(element, key, object)

    }
  }

}