import { BoxBufferGeometry, Mesh, MeshBasicMaterial } from "three";

export function defaultBox(sx = 1, sy = 1, sz = 1) {

  const material = new MeshBasicMaterial({ color: 'lightgreen' })
  const geometry = new BoxBufferGeometry(sx, sy, sz)
  const mesh = new Mesh(geometry, material)

  return mesh


}