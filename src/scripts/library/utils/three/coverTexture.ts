import { Texture } from "three";

export default function coverTexture(texture: Texture, aspect: number = innerWidth / innerHeight) {

  var imageAspect = texture.image.width / texture.image.height

  if (aspect < imageAspect) {

    texture.matrix.setUvTransform(0, 0, aspect / imageAspect, 1, 0.3, 0.5, 0.5)

  } else {

    texture.matrix.setUvTransform(0, 0, 1, imageAspect / aspect, 0.3, 0.5, 0.5)

  }

}