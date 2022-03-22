import Module from "library:modules/Module";
import Route from "library:modules/Router/Route";
import Scroll from "library:modules/Scroll";
import DragControl from "library:modules/Scroll/controls/DragControl";
import KeysControl from "library:modules/Scroll/controls/KeysControl";
import NavigatorControl from "library:modules/Scroll/controls/NavigatorControl";
import WheelControl from "library:modules/Scroll/controls/WheelControl";
import ImageElement from "library:modules/Scroll/elements/ImageElements";
import MovableSegment from "library:modules/Scroll/segments/MovableSegment";
import MovableBranch from "library:modules/WGL/Three/MovableBranch";
import HTMLActor from "library:tools/HTMLActor";
import { elquery } from "library:utils/dom/elquery";
import { query } from "library:utils/dom/query";
import MomentImage from "project:routes/CategoryRoute/MomentImage";
import Branch from "library:modules/WGL/Three/Branch";
import AutoplayControl from "library:modules/Scroll/controls/AutoplayControl";
import Stripe from "./Stripe";
import Navigator from "./Navigator";
import Background from "./Background";

export default class CategoryRoute extends Route {

  private momentImagesActors: Array<MomentImage> = []
  private momentsElements: Array<HTMLElement> = []

  constructor(name: string) {

    super({
      name: name,
      settings: {
        duration: 500,
        easing: 'easeInOutCubic'
      }
    })

  }


  public onLaunch() {

    document.documentElement.setAttribute('data-category', this.name.slice(this.name.lastIndexOf('/') + 1))

    this.createMainScroll()
    this.createNavigatorScroll()
    this.handleDescriptionOverflow()

  }


  public onConservation() {

    if (Module.fastAccess.scroll) {
      this.remove(Module.fastAccess.scroll)
    }


    if (Module.fastAccess.canvas && Module.fastAccess.momentsBranch) {
      Module.fastAccess.canvas.remove(Module.fastAccess.momentsBranch)
    }

    this.momentImagesActors = []

  }


  private createMainScroll() {

    query('.category', (scrollBody) => {

      const categoryName = (scrollBody.getAttribute('data-name') || '').slice(0, 2)
      const scroll = new Scroll({
        body: scrollBody,

      })

      scroll.add(new MovableSegment({ actor: new HTMLActor(scrollBody, 'margin') }))
      scroll.add(new WheelControl())
      scroll.add(new KeysControl())
      scroll.add(new DragControl())
      // scroll.add(new AutoplayControl({
      //   settings: {
      //     await: 6000
      //   }
      // }))

      // const documentActor = new HTMLActor(document.documentElement)


      query('.back__button', (body) => {

        const backNavigator = new NavigatorControl({
          actor: new HTMLActor(body),
          targetActor: new HTMLActor(scrollBody)
        })

        scroll.add(backNavigator)

      })

      const momentsBranch = new MovableBranch({
        name: 'momentsBranch'
      })

      this.momentsElements = query('.moment', (momentBody, momentIndex) => {

        elquery(momentBody, '.moment__image', (imageBody, imageIndex) => {

          const imageActor = new MomentImage(imageBody as HTMLElement, this.momentImagesActors.length, imageIndex)
          imageIndex === 0 && this.momentImagesActors.push(imageActor)

          const image = new ImageElement({
            actor: imageActor,
            name: `${categoryName}-image-${momentIndex + 1}-${imageIndex}`,
            settings: {
              path: imageBody.getAttribute('data-src') || '',
              offset: -1,
              webp: true
            }
          })

          momentsBranch.addComponent(imageActor)
          scroll.add(image)

        })

      })

      this.add(scroll)

      setTimeout(() => {
        momentsBranch.addComponent(new Stripe(this.momentImagesActors))
        momentsBranch.addComponent(new Background())
        Module.fastAccess.canvas.add(momentsBranch)
      }, 0)

      momentsBranch.linkScroll(scroll)

    })

  }


  private createNavigatorScroll() {

    setTimeout(() => {

      const body = document.querySelector('.navigator') as HTMLElement
      const yearsContainerBody = document.querySelector('.navigator__years') as HTMLElement
      const barBody = document.querySelector('.navigator__scrollbar') as HTMLElement
      const knobBody = document.querySelector('.navigator__scrollbar__knob') as HTMLElement
      const yearsBodies = [...document.querySelectorAll('.navigator__year')] as Array<HTMLElement>
      const toggleBody = document.querySelector('.navigator-button') as HTMLElement

      if (body && yearsContainerBody && barBody && knobBody && yearsBodies && toggleBody) {

        const navigator = new Navigator({
          body,
          yearsContainerBody,
          barBody,
          knobBody,
          yearsBodies,
          toggleBody
        })

        this.add(navigator.scroll)

      }

    }, 500)

  }


  private handleDescriptionOverflow() {

    query('.description__paragraph-wrapper', (wrapper) => {

      elquery(wrapper, '.description__paragraph', (description) => {

        if (wrapper.offsetHeight < description.scrollHeight) {
          wrapper.classList.add('has-overflow')
        }

        description.addEventListener('scroll', () => {

          if (description.scrollTop >= description.scrollHeight - wrapper.offsetHeight) {

            wrapper.classList.add('end-scroll')

          } else {

            wrapper.classList.remove('end-scroll')

          }

        })

      })

    })

  }


  public onInTransitonStart() {

    setTimeout(() => {
      document.documentElement.classList.add('category-in')
      document.documentElement.classList.add('category-route')
    }, 0)

  }


  public onOutTransitonStart() {

    document.documentElement.classList.remove('category-in')
    document.documentElement.classList.add('category-out')

    const nextRouteName = this.nextRouteName.slice(this.nextRouteName.lastIndexOf('/') + 1).split('/')[0]

    if (nextRouteName !== 'money' && nextRouteName !== 'technologies' && nextRouteName !== 'achievements') {
      document.documentElement.classList.remove('category-route')
    }

  }


  public onOutTransitonEnd() {
    document.documentElement.classList.remove('category-out')
  }


  public onOutTransitonProgress(t: number) {

    if (Module.fastAccess.momentsBranch) {
      (Module.fastAccess.momentsBranch as Branch).out(t)
    }

    this.momentImagesActors.forEach(actor => {
      actor.out(t)
    })

  }


}