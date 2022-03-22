import Module from "library:modules/Module"
import Scroll from ".."
import TabControl from "./TabControl"

export default class TabbingControl extends Module<{}, Scroll> {

  private counter = -1
  private tabs: Array<TabControl> = []

  constructor() {

    super()

  }


  public onConservation() {

    window.removeEventListener('keydown', this.onKeydown)
    this.counter = -1

  }


  public onLaunch() {

    window.addEventListener('keydown', this.onKeydown)

  }


  public onAfterLaunch() {

    this.filterChildren()
    this.sortTabs()

  }


  private filterChildren() {

    this.tabs = this.children.filter(child => child.indicators.launched) as Array<TabControl>

  }


  public sortTabs() {

    this.tabs = this.tabs.sort((a, b) => {

      const aIndex = a.configuration!.value.index || 1
      const bIndex = b.configuration!.value.index || 0

      return aIndex - bIndex

    })

  }


  protected onKeydown = (event: KeyboardEvent) => {

    if (event.key === 'Tab') {

      event.preventDefault()

      if (!this.tabs.length) return;

      const newValue = this.counter + (event.shiftKey ? -1 : 1)
      this.counter = newValue >= 0 ? newValue % this.tabs.length : Math.min(this.tabs.length - 1, this.tabs.length - newValue)

      const tab = this.tabs[this.counter] as TabControl

      tab.focus()

      if (tab.configuration!.value.preventScroll) return;

      tab.bringIntoSight()

    } else if (event.key === 'Escape') {

      const activeElement = document.activeElement
      const parentElement = this.parent!.actor.body

      if (activeElement !== parentElement) {

        this.counter -= 1

        if (activeElement instanceof HTMLElement) {

          activeElement.blur()
          parentElement.focus()

        }

      }

    }

  }

}