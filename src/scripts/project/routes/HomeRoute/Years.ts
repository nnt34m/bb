import anime from 'animejs';
import THTMLActor from "library:modules/WGL/Three/THTMLActor";
import everyMesh from 'library:utils/three/everyMesh';
import { BufferGeometry, Mesh, MeshStandardMaterial, Object3D } from "three";

export default class Years extends THTMLActor {

  public leftArc?: Mesh
  public rightArc?: Mesh
  public rotationAnimation?: anime.AnimeInstance
  public hideAnimation?: anime.AnimeInstance
  public inAnimation?: anime.AnimeInstance
  public outAnimation?: anime.AnimeInstance
  public meshes: Array<Mesh<BufferGeometry, MeshStandardMaterial>> = []

  constructor(
    body: HTMLElement,
    public readonly model: Object3D
  ) {

    super(body)


    everyMesh(this.model, (mesh) => {

      mesh.material = new MeshStandardMaterial({ transparent: true, opacity: 0 })
      this.meshes.push(mesh as Mesh<BufferGeometry, MeshStandardMaterial>)

      if (mesh.name.includes('left')) {

        this.leftArc = mesh

      } else if (mesh.name.includes('right')) {

        this.rightArc = mesh

      }

    })


    this.meshes = this.meshes.sort((a, b) => {
      return +a.name.slice(0, 1) - +b.name.slice(0, 1)
    })

  }


  public on() {

    super.on()

    this.addObject3d(this.model)

    this.in()
    this.rotate()

  }


  public off() {

    super.off()
    this.destroyInAnimation()
    this.destroyOutAnimation()
    this.destroyRotationAnimation()

  }


  public in() {

    this.inAnimation = anime({
      targets: this.meshes.map(mesh => mesh.material),
      opacity: 1,
      duration: 700,
      easing: 'easeInOutCubic',
      delay: anime.stagger(70, { start: 250 }),
    })

  }


  public destroyInAnimation() {

    if (this.inAnimation) {
      this.inAnimation.pause()
      this.inAnimation = undefined
    }

  }


  public out() {

    this.outAnimation = anime({
      targets: this.meshes.map(mesh => mesh.material),
      opacity: 0,
      duration: 500,
      easing: 'easeInOutCubic',
    })

  }


  public destroyOutAnimation() {

    if (this.outAnimation) {
      this.outAnimation.pause()
      this.outAnimation = undefined
    }

  }


  public rotate() {

    if (this.leftArc && this.rightArc) {

      this.rotationAnimation = anime({
        targets: [this.leftArc.rotation, this.rightArc.rotation],
        x: Math.PI * 2,
        duration: 4000,
        easing: 'easeInOutExpo',
        delay: anime.stagger(100),
        loop: true
      })

    }

  }


  public hide() {

    this.hideAnimation = anime({
      targets: this.meshes.map(mesh => mesh.material),
      opacity: 0,
      duration: 150,
      easing: 'easeInOutCubic',
      delay: anime.stagger(10, { start: 50 }),
    })

  }


  public destroyRotationAnimation() {

    if (this.rotationAnimation) {
      this.rotationAnimation.pause()
      this.rotationAnimation = undefined
    }

  }


  public setInitialScaleX() {

    const min = Math.min(this.size.x, this.size.y)
    this.transformator.initialScale.x = min

  }


  public setInitialScaleY() {

    const min = Math.min(this.size.x, this.size.y)
    this.transformator.initialScale.y = min

  }


  public setInitialScaleZ() {

    const min = Math.min(this.size.x, this.size.y)
    this.transformator.initialScale.z = min * 0.1

  }

}