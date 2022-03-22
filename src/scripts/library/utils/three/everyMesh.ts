import { Mesh, Object3D } from "three";

export default function everyMesh(object3d: Object3D, callback: (mesh: Mesh) => void) {

  object3d.traverse(obj => {

    if (obj.type === 'Mesh') {
      callback(obj as Mesh)
    }

  })

}