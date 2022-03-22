import Module from "library:modules/Module";
import replacePathname from "library:utils/string/replacePathname";
import History from "./History";
import Link from "./Link";
import Route from "./Route";

export default class Router extends Module {

  public readonly base: string
  public readonly origin: string
  public readonly history = new History(this)

  public activeRoute?: Route
  public navigationLinks: Array<Link> = []
  public currentLinks: Array<Link> = []


  constructor(base = '') {

    super()

    this.base = base || ''
    this.origin = location.origin
    this.launchChildren = false
    this.name = 'router'
    this.layer = 'router'
    this.type = 'router'

  }


  public onLanguageChange?(lang: string): void


  public onLaunch() {

    this.findNavigationLinks()
    this.findFirstRoute()

  }


  public add(route: Route) {

    route.href = `${this.origin}${this.base}${route.name}`
    super.add(route)

  }


  private findFirstRoute() {

    let match: Route | undefined

    this.eachChild<Route>(route => {

      const currentLocation = location.href.endsWith('/') ? location.href.slice(0, -1) : location.href
      const currentRouteLocation = route.href.endsWith('/') ? route.href.slice(0, -1) : route.href

      if (currentRouteLocation === currentLocation) {
        match = route
      }

    }, true)


    if (match) {

      match.collected = true
      this.activateRoute(match)
      this.replaceLang(match.lang)

    }

  }


  private findNavigationLinks() {

    this.navigationLinks = [...document.querySelectorAll('[data-nav-link]')].map(htmlElement => new Link(this, htmlElement as HTMLAnchorElement))

  }


  private findCurrentLinks() {

    this.currentLinks.forEach(link => link.off())
    this.currentLinks = [...document.querySelectorAll('a:not([data-nav-link])')].map(htmlElement => {
      if (htmlElement.hasAttribute('href') && htmlElement.getAttribute('href')!.startsWith('/')) {
        return new Link(this, htmlElement as HTMLAnchorElement)
      }
    }).filter(v => !!v) as Array<Link>

  }


  private async activateRoute(route: Route) {

    this.activeRoute = route

    await this.activeRoute.launch()
    this.activeRoute.bringIn()
    this.findCurrentLinks()


    this.currentLinks.forEach(link => {
      link.replaceLang(this.activeRoute!.lang)
    })

    this.navigationLinks.forEach(link => {
      link.replaceLang(this.activeRoute!.lang)
    })

  }


  async fetchData(routeName: string) {

    const route = this.findRoute(routeName) as Route | undefined
    if (!route || route.html) return;

    if (route.name === '/?') {
      route.__href = replacePathname(route.href, routeName)
      route.__name = routeName
    }

    let response: any

    try {

      response = await fetch(route.__href || route.href)

    } catch (error) {

      console.error(error)

    }


    try {

      const data = await response.text()
      this.setRouteHTML(route, data)
      return true

    } catch (error) {

      console.error(error)

    }

  }



  private findRoute(routeName: string) {

    return (this.findChildByName(routeName, true) || this.findChildByName('/?', true)) as Route

  }


  async switchRoute(routeName: string, pushHistory = true) {

    if (this.activeRoute!.name === routeName) return;

    const newRoute = this.findRoute(routeName)

    if (!newRoute) return console.error(routeName, ' - no route with that name was found')

    if (this.activeRoute!.transitionRunning) {
      this.activeRoute!.breakTransition()
    }

    try {
      this.activeRoute!.nextRouteName = newRoute.name
      await this.activeRoute!.bringOut()
      this.activeRoute!.conserve()
      await this.fetchData(routeName)
      this.activeRoute = newRoute
      await this.collect(this.activeRoute!)
      this.replaceContent(this.activeRoute!)
      pushHistory && this.history.push(this.activeRoute!)
      this.activateRoute(newRoute)

    } catch (e) {

      console.error(e)

    }

  }



  private setRouteHTML(route: Route, page: string) {

    const htmlElement = document.createElement('div')
    htmlElement.innerHTML = page
    route.html = htmlElement

    const reg = /lang="(.*?)"/
    const regres = reg.exec(page)

    if (regres && regres[1]) {
      route.lang = regres[1]
    }

  }


  private replaceContent(route: Route) {

    if (!route.html) return

    const newContent = route.html.querySelector(route.contentSelector)
    const oldContent = document.querySelector(route.contentSelector)

    if (newContent && oldContent) {

      oldContent.replaceWith(newContent.cloneNode(true))
      this.replaceLang(route.lang)

    }

  }


  private replaceLang(lang: string) {

    document.documentElement.lang = lang
    this.onLanguageChange?.(lang)

  }


  private collect(route: Route) {

    if (!route.html || route.collected) return

    const head = document.querySelector('head')

    if (!head) return;

    const elementsToCollect = [...route.html.querySelectorAll('[rel="stylesheet"]'), ...route.html.querySelectorAll('style')]

    const elementsToLoad: Array<HTMLElement> = []

    elementsToCollect.forEach(element => {

      if (element instanceof HTMLLinkElement) {

        if (element.href.includes('global')) {
          return
        }

        const assetsIndex = element.href.indexOf('/assets')
        element.href = element.href.slice(assetsIndex)

      }

      if (!head.outerHTML.includes(element.outerHTML)) {

        head.appendChild(element)
        elementsToLoad.push(element as HTMLElement)

      }

    })

    if (elementsToLoad.length) {

      return new Promise((resolve) => {

        let counter = 0
        elementsToLoad.forEach(elementToLoad => {

          elementToLoad.onload = () => {

            counter++

            if (counter === elementsToLoad.length) {

              resolve(true)

            }

          }

        })

      })

    }

  }

}