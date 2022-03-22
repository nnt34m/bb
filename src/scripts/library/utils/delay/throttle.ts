export default function throttle(callback: Function, wait: number = 0): (args: any) => void {

  let time = Date.now()

  return args => {

    if ((time + wait - Date.now()) < 0) {

      callback(args)
      time = Date.now()

    }

  }

}