import { Material, Mesh, Object3D } from "three"

export function dispose(object3d: Object3D) {

  const cleanMaterial = (material: Material) => {

    material.dispose()

    for (const key of Object.keys(material)) {

      const value = material[key as keyof Material]

      if (value && typeof value === 'object' && 'minFilter' in value) {

        value.dispose()

      }

    }

  }


  object3d.traverse((object: Object3D) => {

    if (!(object instanceof Mesh)) return;

    object.geometry.dispose()

    if (!Array.isArray(object.material) && object.material.isMaterial) {

      cleanMaterial(object.material)

    } else if (Array.isArray(object.material)) {

      for (const material of object.material) cleanMaterial(material)

    }

  })

}