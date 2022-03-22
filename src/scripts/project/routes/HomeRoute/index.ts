import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


import Module from "library:modules/Module";
import Route from "library:modules/Router/Route";
import { query } from "library:utils/dom/query";
import splitText from "library:utils/dom/splitText";
import CanvasBranch from "./CanvasBranch";
import { Object3D } from 'three';
import device from 'library:autonomous/device';

export default class HomeRoute extends Route {

  constructor(language: string) {

    super({
      name: `/${language}`,
      settings: {
        transitionIn: {
          duration: 100,
          easing: 'easeInOutExpo'
        },
        transitionOut: {
          duration: 1000,
          easing: 'easeInOutExpo'
        }
      }
    })

  }


  public onBeforeLaunch(res: Function, rej: Function) {

    new GLTFLoader().load(
      `/assets/models/year/${this.lang}.glb`,
      (gltf) => {
        this.createCanvasBranch(gltf.scene)
        res()
      },
      () => { },
      (e) => {
        rej()
      }
    )

  }


  public onLaunch() {

    this.splitSlogan()
    this.listenStartButton()
    this.listenCategories()

  }


  public onReset() {

    this.destroyCanvasBranch()

  }


  private splitSlogan() {

    query('.logo-slogan-line', (el) => {

      splitText(el, {
        letters: true,
        lettersDelay: 0.8,
        vars: true
      })

    })

  }


  private listenStartButton() {

    query('.start-button', (el) => {
      el.addEventListener('click', this.openCategories)
    })

  }


  private listenCategories() {

    query('.category-link', (el) => {
      el.addEventListener('click', () => {
        document.documentElement.classList.add('categories-out')
        document.documentElement.classList.add('category-route')
        el.classList.add('choosen')
        const dy = innerHeight / 2 - el.offsetTop - el.offsetHeight / 2
        el.style.setProperty('--dy', dy + 'px')
      })
    })

  }


  private openCategories = () => {

    if (device.isMobile) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.()
      }
    }

    if (Module.fastAccess.homeBranch) {
      (Module.fastAccess.homeBranch as CanvasBranch).hideBackground()
    }

    document.documentElement.classList.remove('intro-in')
    document.documentElement.classList.add('intro-out')
    document.documentElement.classList.add('categories-in')
    this.hideYears()

  }


  private createCanvasBranch(model: Object3D) {

    if (Module.fastAccess.canvas) {
      Module.fastAccess.canvas.add(new CanvasBranch(model))
    }

  }


  private destroyCanvasBranch() {

    if (Module.fastAccess.canvas && Module.fastAccess.homeBranch) {
      Module.fastAccess.canvas.remove(Module.fastAccess.homeBranch)
    }

  }


  private outCanvasBranch() {

    if (Module.fastAccess.canvas && Module.fastAccess.homeBranch) {
      (Module.fastAccess.homeBranch as CanvasBranch).outYears()
    }

  }


  private hideYears() {

    if (Module.fastAccess.canvas && Module.fastAccess.homeBranch) {
      (Module.fastAccess.homeBranch as CanvasBranch).hideYears()
    }

  }


  public onOutTransitonStart() {

    document.documentElement.classList.remove('home-in')
    document.documentElement.classList.remove('categories-in')
    document.documentElement.classList.add('home-out')

    this.outCanvasBranch()

  }


  public onOutTransitonEnd() {

    document.documentElement.classList.remove('intro-out')
    document.documentElement.classList.remove('home-out')
    document.documentElement.classList.remove('categories-out')

  }


  public onInTransitonStart() {

    document.documentElement.removeAttribute('data-category')
    document.documentElement.classList.remove('home-out')
    document.documentElement.classList.remove('category-route')
    document.documentElement.classList.add('intro-in')

  }


  public onInTransitonEnd() {

    document.documentElement.classList.add('home-in')

  }

}