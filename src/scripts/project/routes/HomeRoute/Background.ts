import anime from "animejs"
import { BranchComponent } from "library:modules/WGL/Three/Branch"
import { dispose } from "library:utils/three/dispose"
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, Points, ShaderMaterial } from "three"

export default class Background implements BranchComponent {

  private active = false

  public readonly base = new Group()
  public readonly amount = 100

  public readonly uniforms = {
    uTime: { value: 0 },
    uOpacity: { value: 0 },
  }


  public on() {

    this.active = true

  }


  public off() {

    dispose(this.base)

  }


  public hide() {

    anime({
      targets: this.uniforms.uOpacity,
      value: [1, 0],
      duration: 1000,
      easing: 'easeInOutExpo',
    })

  }


  public in() {

    anime({
      targets: this.uniforms.uOpacity,
      value: [0, 0.5],
      duration: 1000,
      easing: 'easeInOutExpo',
    })

  }


  public resize() {

    this.create()

  }


  private create() {

    dispose(this.base)
    this.base.children = []

    const geometry = new BufferGeometry()


    const positions = new Float32Array(this.amount * 3)


    for (let i = 0; i < this.amount; i++) {

      const i3 = i * 3

      const randomX = (Math.random() - 0.5) * innerWidth * 1.5
      const randomY = (Math.random() - 0.5) * innerHeight * 1.5
      const randomZ = (Math.random() - 0.5) * 2000

      positions[i3] = randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = randomZ

    }

    geometry.setAttribute('position', new BufferAttribute(positions, 3))

    const material = new ShaderMaterial({
      vertexShader: `

        uniform float uTime;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);

          modelPosition.x += cos(uTime + modelPosition.z) * 100.0;
          modelPosition.y += sin(uTime + modelPosition.z) * 100.0;

          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_PointSize = clamp(position.z, 5.0, 20.0);
          gl_Position = projectedPosition;
        }
      `,
      fragmentShader: `

        uniform float uOpacity;
        uniform float uTime;

        void main() {

          float strength = distance(gl_PointCoord, vec2(0.5));
          strength = step(0.2, strength);
          strength = 1.0 - strength;

          float s = abs(cos(uTime));

          float r = (33.0 + (255.0 - 33.0) * s) / 255.0;
          float g = (160.0 + (255.0 - 160.0) * s) / 255.0;
          float b = (115.0 + (255.0 - 115.0) * s) / 255.0;

          vec4 color = mix(vec4(0.0), vec4(r, g, b, 0.5), strength);

          if(color.a == 0.0) discard;

          gl_FragColor = color;
          gl_FragColor.a = uOpacity;

        }
      `,
      uniforms: this.uniforms,
      blending: AdditiveBlending,
      vertexColors: true,
      transparent: true,

    })


    const points = new Points(
      geometry,
      material
    )

    this.base.add(points)

    this.in()

  }


  public tick(t: number) {

    this.uniforms.uTime.value = t * 0.0001

  }

}