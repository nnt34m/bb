import Router from "."

export default class Link {

  public href: string
  public prefetch: boolean
  private lang = ''

  constructor(readonly router: Router, readonly htmlElement: HTMLAnchorElement) {

    this.href = htmlElement.getAttribute('href') || ''
    this.prefetch = htmlElement.hasAttribute('data-prefetch')
    this.on()

  }


  public on() {

    this.htmlElement.addEventListener('click', this.handleClick)

    if (this.prefetch) {

      this.htmlElement.addEventListener('mouseenter', this.handleHover)

    }

  }


  public off() {

    this.htmlElement.removeEventListener('click', this.handleClick)
    this.htmlElement.removeEventListener('mouseenter', this.handleHover)

  }


  public replaceLang(lang: string) {

    this.lang = lang
    this.htmlElement.href = this.href.replace('[lang]', this.lang)

  }


  private handleClick = (event: Event) => {

    event.preventDefault()
    this.router.switchRoute(this.href.replace('[lang]', this.lang))

  }


  private handleHover = (event: Event) => {

    this.htmlElement.removeEventListener('mouseenter', this.handleHover)
    this.router.fetchData(this.href.replace('[lang]', this.lang))

  }

}