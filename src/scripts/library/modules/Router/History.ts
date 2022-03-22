import Router from "."
import Route from "./Route"

export default class History {

  constructor(readonly router: Router) {

    addEventListener('popstate', this.handlePopstate)

  }


  public push(route: Route) {

    if (route.settings.history) {

      const name = route.__name || route.name
      const href = route.__href || route.href

      history.pushState({ routeName: name }, '', href)

    }

  }


  private handlePopstate = (event: PopStateEvent) => {

    let routeName = event.state && event.state.routeName || location.pathname

    this.router.switchRoute(routeName, false)

  }


}