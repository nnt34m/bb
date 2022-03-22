import Scroll from "library:modules/Scroll";
import Branch from "./Branch";

export default class MovableBranch extends Branch {

  public scroll: Scroll | null = null

  constructor(parameters?: { name?: string }) {

    super({ name: 'movableBranch', ...parameters })

  }


  public linkScroll(scroll: Scroll) {

    this.scroll = scroll

  }


  public unlinkScroll() {

    this.scroll = null

  }


  public onTick(t: number) {

    if (this.scroll) {

      if (this.scroll!.configuration!.value.axis === 'x') {

        this.base.position.x = this.scroll!.track.progress.lerp * -1

      } else {

        this.base.position.y = this.scroll!.track.progress.lerp

      }

    }

    super.onTick(t)

  }

}