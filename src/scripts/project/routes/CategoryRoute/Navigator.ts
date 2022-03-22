import Module from "library:modules/Module"
import Scroll from "library:modules/Scroll"
import DragControl from "library:modules/Scroll/controls/DragControl"
import NavigatorControl from "library:modules/Scroll/controls/NavigatorControl"
import ScrollbarControl from "library:modules/Scroll/controls/ScrollbarControl"
import WheelControl from "library:modules/Scroll/controls/WheelControl"
import MovableSegment from "library:modules/Scroll/segments/MovableSegment"
import HTMLActor from "library:tools/HTMLActor"

export default class Navigator {

  private opened = false
  public readonly scroll: Scroll
  public readonly toggleBody: HTMLElement

  constructor(
    parameters: {
      body: HTMLElement,
      yearsContainerBody: HTMLElement,
      barBody: HTMLElement,
      knobBody: HTMLElement,
      yearsBodies: Array<HTMLElement>,
      toggleBody: HTMLElement,
    }
  ) {

    this.scroll = new Scroll({
      body: parameters.body,
      name: 'nav-scroll',
    })


    this.scroll.add(new MovableSegment({
      actor: new HTMLActor(parameters.yearsContainerBody, 'margin')
    }))


    this.scroll.add(new WheelControl({
      layer: 'nav-scroll'
    }))


    this.scroll.add(new DragControl({
      layer: 'nav-scroll'
    }))


    this.scroll.add(new ScrollbarControl({
      layer: 'nav-scroll',
      bar: new HTMLActor(parameters.barBody),
      knob: new HTMLActor(parameters.knobBody),
    }))

    this.toggleBody = parameters.toggleBody

    this.createNavigatorControls(parameters.yearsBodies)

    this.toggle()

  }


  private createNavigatorControls(yearsBodies: Array<HTMLElement>) {

    yearsBodies.forEach(navigatorYearBody => {

      const year = navigatorYearBody.getAttribute('data-year')
      const momentBody = document.querySelector(`.moment[data-year="${year}"]`) as HTMLElement

      if (momentBody && Module.fastAccess.scroll) {

        Module.fastAccess.scroll.add(new NavigatorControl({
          name: `nav-${year}`,
          actor: new HTMLActor(navigatorYearBody),
          targetActor: new HTMLActor(momentBody),
          settings: {
            offset: -0.1,
          }
        }))

      }

    })

  }


  private toggle() {

    this.toggleBody.addEventListener('click', () => {

      this.scroll.actor.body.classList.toggle('opened')
      this.toggleBody.classList.toggle('opened')
      this.opened = !this.opened

      if (this.opened) {

        setTimeout(() => {
          addEventListener('click', this.close)
        }, 0)

      } else {

        setTimeout(() => {
          removeEventListener('click', this.close)
        }, 0)

      }

    })

  }


  private close = (event: MouseEvent) => {

    if (!this.scroll.actor.body.contains((event.target as HTMLElement))) {
      this.opened = false
      this.scroll.actor.body.classList.remove('opened')
      this.toggleBody.classList.remove('opened')
      removeEventListener('click', this.close)
    }

  }

}