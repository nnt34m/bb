import cumulativeLeft from "library:utils/coordinates/cumulativeLeft"
import cumulativeTop from "library:utils/coordinates/cumulativeTop"
import XY from "library:utils/coordinates/XY"
import heightWithMargins from "library:utils/sizes/heightWithMargins"
import widthWithMargins from "library:utils/sizes/widthWithMargins"
import ComplexActor, { DataTypes } from "./ComplexActor"

export type Listeners = Map<string, Array<Function>>
export type HTMLActorPositionTypes = 'absolute' | 'relative'
export type HTMLActorSizeTypes = 'offset' | 'margin'

export default class HTMLActor extends ComplexActor {

  protected listeners: Listeners = new Map()
  public readonly size = new XY()
  public readonly position = new XY()

  constructor(

    readonly body: HTMLElement,
    readonly sizeType: HTMLActorSizeTypes = 'offset',
    readonly positionType: HTMLActorPositionTypes = 'absolute',

  ) {

    super()

  }


  public resize() {

    if (this.sizeType === 'offset') {
      this.size.set(this.body.offsetWidth, this.body.offsetHeight)
    } else if (this.sizeType === 'margin') {
      this.size.set(widthWithMargins(this.body), heightWithMargins(this.body))
    }

    if (this.positionType === 'relative') {
      this.position.set(this.body.offsetLeft, this.body.offsetTop)
    } else if (this.positionType === 'absolute') {
      this.position.set(cumulativeLeft(this.body), cumulativeTop(this.body))
    }



  }


  public on() {


  }


  public off() {

    this.body.style.transform = ''

  }



  protected addEventListener(event: string, callback: Function, ...options: any[]) {

    this.body.addEventListener(event, callback as EventListener, ...options)

  }


  protected removeEventListener(event: string, callback: Function) {

    this.body.removeEventListener(event, callback as EventListener)

  }


  public receiveEvent(event: string, ...args: Array<any>) {

  }





  public focus(options: { preventScroll: boolean }) {

    this.body.focus(options)

  }


  public blur() {

    this.body.blur()

  }





  protected transform() {

    this.body.style.transform = `matrix(${this.transformation.join(',')})`

  }




  public setData(type: DataTypes, name: string, value?: any): void {

    if (type === 'class') {

      this.setClass(name)

    }

    else if (type === 'custom') {

      this.setDataAttribute(name, value)

    }

    else if (type === 'native') {

      this.setNativeAttribute(name, value)

    }

    else if (type === 'style') {

      this.setStyle(name, value)

    }

    else if (type === 'variable') {

      this.setVariable(name, value)

    }

  }


  public setClass(name: string) {

    if (name) {

      this.body.classList.add(name)

    }

  }


  public setDataAttribute(name: string, value?: any) {

    this.body.setAttribute('data-' + name, value)

  }


  public setNativeAttribute(name: string, value?: any) {

    //@ts-ignore
    this.body[name] = value

  }


  public setStyle(name: string, value?: any) {

    //@ts-ignore
    this.body.style[name] = value

  }


  public setVariable(name: string, value?: any) {

    this.body.style.setProperty('--' + name, value)

  }




  public getData(type: DataTypes, name: string = '') {

    if (type === 'class') {

      return this.getClass()

    }

    else if (type === 'custom') {

      return this.getDataAttribute(name)

    }

    else if (type === 'native') {

      return this.getNativeAttribute(name)

    }

    else if (type === 'style') {

      return this.getStyle(name)

    }

    else if (type === 'variable') {

      return this.getVariable(name)

    }

  }


  public getClass() {

    return this.body.classList

  }


  public getDataAttribute(name: string) {

    return this.body.getAttribute('data-' + name)

  }


  public getNativeAttribute(name: string) {

    //@ts-ignore
    return this.body[name]

  }


  public getStyle(name: string) {

    //@ts-ignore
    return this.body.style[name]

  }


  public getVariable(name: string) {

    return this.body.style.getPropertyValue('--' + name)

  }




  public removeData(type: DataTypes, name: string): void {

    if (type === 'class') {

      this.removeClass(name)

    }

    else if (type === 'custom') {

      this.removeDataAttribute(name)

    }

    else if (type === 'native') {

      this.removeNativeAttribute(name)

    }

    else if (type === 'style') {

      this.removeStyle(name)

    }

    else if (type === 'variable') {

      this.removeVariable(name)

    }

  }


  public removeClass(name: string) {

    if (name) {
      this.body.classList.remove(name)
    }

  }


  public removeDataAttribute(name: string) {

    this.body.removeAttribute('data-' + name)

  }


  public removeNativeAttribute(name: string) {

    //@ts-ignore
    this.body[name] = ''

  }


  public removeStyle(name: string) {

    //@ts-ignore
    this.body.style[name] = ''

  }


  public removeVariable(name: string) {

    this.body.style.removeProperty('--' + name)

  }

}