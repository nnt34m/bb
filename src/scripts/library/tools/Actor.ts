import { Toggable } from "library:interfaces"
import XY from "library:utils/coordinates/XY"

export type DataTypes = 'class' | 'custom' | 'native' | 'variable' | 'style'
export type Listeners = Map<string, Array<Function>>

export default abstract class Actor implements Toggable {

  public readonly size = new XY()
  public readonly position = new XY()

  constructor() { }

  public abstract resize(size?: XY): void
  public abstract receiveEvent(event: string, ...args: Array<any>): void

  public abstract on(): void
  public abstract off(): void

}