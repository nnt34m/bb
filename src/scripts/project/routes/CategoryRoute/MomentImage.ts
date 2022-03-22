import anime from 'animejs';
import loader from 'library:modules/WGL/Three/loader'
import THTMLActor from "library:modules/WGL/Three/THTMLActor";
import { KV } from "library:types";
import XY from 'library:utils/coordinates/XY';
import { Mesh, PlaneBufferGeometry, ShaderMaterial, Texture, TextureLoader, Vector2 } from "three";

export default class MomentImage extends THTMLActor {

  private isPaper = false
  private uniforms: {
    uTexture: { value: Texture | null },
    uLoad: { value: number },
    uShow: { value: number },
    uTime: { value: number },
    uIndex: { value: number },
    uZAmp: { value: number },
    uResolution: { value: Vector2 },
  } = {
      uTexture: { value: null },
      uLoad: { value: 0.0 },
      uShow: { value: 0.0 },
      uTime: { value: 0.0 },
      uIndex: { value: 0 },
      uZAmp: { value: 0 },
      uResolution: { value: new Vector2() },
    }

  constructor(
    imageBody: HTMLElement,
    number: number,
    public readonly index: number,
  ) {
    super(imageBody)

    this.isPaper = this.body.hasAttribute('data-paper')
    this.uniforms.uIndex.value = number + 1

  }


  public setNativeAttribute(name: string, value?: any) {

    this.onLoad(value)

  }


  private onLoad(src: string) {

    this.createMesh();

    (loader.loaders.textureLoader as TextureLoader).load(src, (texture) => {

      this.uniforms.uTexture.value = texture

      anime({
        targets: this.uniforms.uLoad,
        value: [0, 1],
        duration: 1500,
        easing: 'easeInOutExpo',
      })

    })

  }


  public out(t: number) {
    this.uniforms.uShow.value = 1 - t
  }


  private createMesh() {

    const geometry = this.isPaper ? new PlaneBufferGeometry(1, 1, 40, 40) : new PlaneBufferGeometry(1, 1)

    const defaultVertex = `
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform float uZAmp;

      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);

        modelPosition.z += cos(modelPosition.x * uZAmp * 0.035 ) * uResolution.x * uZAmp;
        modelPosition.y += sin(modelPosition.x * 0.0024 ) * 10.0;
        modelPosition.x += sin(modelPosition.z * 0.0028 ) * 10.0;


        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;

        gl_Position = projectedPosition;
        vUv = uv;
      }
    `


    const defaultFragment = `
      uniform sampler2D uTexture;
      uniform float uLoad;
      uniform float uTime;
      uniform float uShow;
      uniform float uIndex;
      varying vec2 vUv;


      void main() {
        vec4 textureColor = texture2D(uTexture, vUv);

        if (uLoad >= 0.01 && textureColor.a < 0.5 ) discard;

        float pr = 1.0 - uLoad;

        vec2 wavedUv = vec2(
          cos(uTime) * 1.5 * pr + vUv.x + cos(vUv.y * 60.0 + uIndex) * (2.0 + cos(uTime + vUv.x) * 0.9) * pr,
          sin(uTime) * 1.5 * pr + vUv.y + sin(vUv.x * 60.0 + uIndex) * (2.0 + sin(uTime + vUv.y) * 0.9) * pr
        );

        float strength = 1.0 - step(0.1 + 0.9 * uLoad, abs(distance(wavedUv, vec2(0.5)) - 0.1));

        float r = 33.0 / 255.0;
        float g = 160.0 / 255.0;
        float b = 115.0 / 255.0;
        r *= strength + 0.1;
        g *= strength + 0.1;
        b *= strength + 0.1;

        if (r <= 0.1) discard;

        vec4 placeHolderColor = vec4(r, g, b, 1.0);
        vec4 mix = mix(placeHolderColor, textureColor, uLoad);

        gl_FragColor = mix;
        gl_FragColor.a = uShow;
      }
    `

    const material = new ShaderMaterial({

      transparent: true,
      uniforms: this.uniforms,
      vertexShader: defaultVertex,
      fragmentShader: defaultFragment

    })

    const max = Math.max(innerHeight, innerWidth)
    const mesh = new Mesh(geometry, material)

    const st = 0.1
    mesh.position.z = max * (st * -1) + Math.abs(Math.sin(this.index * 0.5)) * max * ((st * 2) * -1)
    this.addObject3d(mesh)

    anime({
      targets: this.uniforms.uShow,
      value: 1,
      duration: 2000,
      easing: 'easeInOutExpo',
    })

  }


  public resize(size?: XY): void {
    super.resize(size)
    this.uniforms.uResolution.value.x = innerWidth
    this.uniforms.uResolution.value.y = innerHeight

    if (innerWidth <= 1024) {
      this.uniforms.uZAmp.value = 0.09
      if (innerHeight <= 450) {
        this.uniforms.uZAmp.value = 0.13
      }

    } else {
      this.uniforms.uZAmp.value = 0.06
    }

  }


  public tick(t: number): void {

    super.tick(t)

    this.uniforms.uTime.value = t * 0.001

  }

}