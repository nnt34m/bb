import { Coordinate2D } from "___/types";

export default function (point: { x: number, y: number }, rect: { position: Coordinate2D, size: Coordinate2D }) {

  if (

    point.x < rect.position.x + rect.size.x &&
    point.x > rect.position.x &&
    point.y < rect.position.y + rect.size.y &&
    point.y > rect.position.y

  ) {

    return true

  }

}