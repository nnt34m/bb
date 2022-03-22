import anime from 'animejs'
import state from 'library:autonomous/state'
import Unit from 'library:autonomous/state/Unit'
import Module from 'library:modules/Module'
import Scroll from 'library:modules/Scroll'
import { BranchComponent } from 'library:modules/WGL/Three/Branch'
import randomBounce from 'library:utils/random/randomBounce'
import { dispose } from 'library:utils/three/dispose'
import store from 'project:store'
import { CatmullRomCurve3, ExtrudeGeometry, Group, Mesh, MeshBasicMaterial, ShaderMaterial, Shape, Vector2, Vector3 } from 'three'
import MomentImage from './MomentImage'

export default class Stripe implements BranchComponent {

  private active = false
  public readonly base = new Group()
  public readonly configuration: Unit<{
    yAmplitude: number,
    zOffset: number,
    sizeMult: number,
  }>

  private uniforms: {
    uTime: { value: number },
    uOpacity: { value: number },
  } = {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
    }

  constructor(
    public readonly images: Array<MomentImage>
  ) {

    this.configuration = state.getUnit({
      layerName: 'stripe',
      unitName: 'stripe',
      layerInstanceID: 'default',
      settings: {
        yAmplitude: 0,
        zOffset: 500,
        sizeMult: 0.05,
      }
    })

    this.configuration.subscribe(this.onConfigurationChange)

  }


  public on() {
    this.active = true
  }


  public off() {
    dispose(this.base)
    this.configuration.unsubscribe(this.onConfigurationChange)
    this.disposeRibbon()
  }


  public out(t: number) {

    if (this.base.children[0]) {

      this.uniforms.uOpacity.value = (1 - t)

    }

  }


  public in() {

    if (this.base.children[0]) {

      anime({
        targets: this.uniforms.uOpacity,
        value: [0, 1],
        duration: 1000,
        delay: 1000,
        easing: 'easeInOutExpo',
      })

    }

  }


  public resize() {

    this.generateRibbon()

  }


  private onConfigurationChange = () => {

    if (this.active) {
      this.generateRibbon()
    }

  }


  private generateRibbon() {

    this.disposeRibbon()

    const start = this.getCurveStart()
    const end = this.getCurveEnd()
    const points = this.generateCurvePoints()
    const curve = this.createCurve(start, points, end)

    this.createRibbon(curve)

  }


  private createRibbon(curve: CatmullRomCurve3) {

    const { sizeMult } = this.configuration.currentValues

    const min = Math.min(innerWidth, innerHeight)
    const hh = 0
    const hw = min * sizeMult
    const profile = new Shape([
      new Vector2(-hw, -hh),
      new Vector2(-hw, hh),
      new Vector2(hw, hh),
      new Vector2(hw, -hh),
      new Vector2(-hw, -hh),
    ]);

    const ribbonGeometry = new ExtrudeGeometry(profile, {
      steps: Math.floor((Module.fastAccess.scroll as Scroll).size.page * 0.5),
      bevelEnabled: false,
      extrudePath: curve,
    })

    const defaultVertex = `
    varying vec2 vPosition;

    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;

      gl_Position = projectedPosition;
      vPosition = position.xy;
    }
  `


    const defaultFragment = `
      varying vec2 vPosition;
      uniform float uTime;
      uniform float uOpacity;

      void main() {

        float r = 28.0 / 255.0;
        float g = 170.0 / 255.0;
        float b = 73.0 / 255.0;

        float st = (1.0 - abs(cos((vPosition.y * 10.0 + vPosition.x ) * 0.0007 - uTime))) * 0.5;
        vec4 mix = vec4(r + st, g + st, b + st, 0.2 + smoothstep(0.0, 0.1, st ) * 0.3 );

        gl_FragColor = mix;
        gl_FragColor.a *= uOpacity;
      }
    `

    const material = new ShaderMaterial({

      transparent: true,
      uniforms: this.uniforms,
      vertexShader: defaultVertex,
      fragmentShader: defaultFragment,

    })

    const mesh = new Mesh(ribbonGeometry, material)
    this.base.add(mesh)

    this.in()

  }


  private getCurveStart() {

    return new Vector3(-innerWidth / 1.5, 0)

  }


  private getCurveEnd() {

    return new Vector3((Module.fastAccess.scroll as Scroll).size.page - innerWidth / 2, 0)

  }


  private createCurve(start: Vector3, points: Array<Vector3>, end: Vector3) {

    return new CatmullRomCurve3([
      start,
      ...points,
      end,
    ])

  }


  private generateCurvePoints() {

    const points: Array<Vector3> = []

    const { yAmplitude, zOffset } = this.configuration.currentValues
    const offset = 3

    for (let stepIndex = 0; stepIndex < this.images.length; stepIndex++) {

      const image = this.images[stepIndex]
      const rb = randomBounce(stepIndex, 4)
      const step = new Vector3(
        image.transformator.initialPosition.x,
        Math.cos(stepIndex + 2) * innerHeight * yAmplitude,
        stepIndex === 0 ? -zOffset * offset : zOffset * rb * (rb < 0 ? offset : 1),
      )

      points.push(step)

    }

    return points

  }


  private disposeRibbon() {

    dispose(this.base)
    this.base.children = []

  }


  public tick(t: number) {

    this.uniforms.uTime.value = t * 0.0007

  }

}