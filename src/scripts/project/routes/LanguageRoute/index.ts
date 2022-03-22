import device from "library:autonomous/device";
import Route from "library:modules/Router/Route";
import { query } from "library:utils/dom/query";

export default class LanguageRoute extends Route {

  constructor() {

    super({
      name: '/',
      settings: {
        duration: 500,
        easing: 'easeInOutExpo'
      }
    })

  }


  public onLaunch() {

    if (device.isMobile) {

      query('.language-link', el => {
        el.addEventListener('click', () => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
          }
        })
      })

    }

  }


  public onOutTransitonStart() {

    document.documentElement.classList.add('language-out')
    document.documentElement.classList.remove('language-in')

  }

  public onOutTransitonEnd() {

    document.documentElement.classList.remove('language-out')
    document.documentElement.classList.remove('language-in')

  }


  public onInTransitonStart() {

    document.documentElement.classList.remove('category-route')
    document.documentElement.classList.remove('language-out')
    setTimeout(() => {
      document.documentElement.classList.add('language-in')
    }, 10)

  }

}