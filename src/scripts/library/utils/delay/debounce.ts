export default function (callback: Function, timeout: number = 300): (...args: any) => void {

  let timer: number

  return (...args) => {

    clearTimeout(timer)
    timer = setTimeout(() => callback(...args), timeout)

  }

}