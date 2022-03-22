export default class Modal {

  private callers: Array<HTMLElement> = []
  private closers: Array<HTMLElement> = []
  private container: HTMLElement
  private name: string
  private closeDuration: number
  private closeTimeoutID: number = -1

  constructor(parameters: {
    container: HTMLElement,
    closeDuration?: number
  }) {

    this.container = parameters.container
    this.closeDuration = parameters.closeDuration || 1000
    this.name = this.container.getAttribute('data-modal') || ''
    this.findParts()
    this.listen()

  }


  private findParts() {

    this.callers = [...document.querySelectorAll(`[data-modal-caller="${this.name}"]`)] as Array<HTMLElement>
    this.closers = [...document.querySelectorAll(`[data-modal-closer="${this.name}"]`)] as Array<HTMLElement>
    console.log(this);

  }


  private listen() {

    this.callers.forEach(caller => {
      caller.addEventListener('click', this.open)
    })


    this.closers.forEach(closer => {
      closer.addEventListener('click', this.close)
    })

  }


  public open = () => {

    clearTimeout(this.closeTimeoutID)

    this.container.classList.add('ready')
    setTimeout(() => {
      this.container.classList.add('active')
      this.listenSpecialClosers()
    }, 0)

  }


  public close = () => {

    this.container.classList.remove('active')
    this.closeTimeoutID = setTimeout(
      () => this.container.classList.remove('ready')
      , this.closeDuration)
    this.unlistenSpecialClosers()

  }


  private listenSpecialClosers() {

    addEventListener('mousedown', this.handleClickOutside)
    addEventListener('touchstart', this.handleClickOutside)
    addEventListener('keydown', this.handleKeydown)

  }


  private unlistenSpecialClosers() {

    removeEventListener('mousedown', this.handleClickOutside)
    removeEventListener('touchstart', this.handleClickOutside)
    removeEventListener('keydown', this.handleKeydown)

  }


  private handleKeydown = (event: KeyboardEvent) => {

    if (event.key === 'Escape') {

      this.close()

    }

  }


  private handleClickOutside = (event: MouseEvent | TouchEvent) => {

    if (!this.container.contains(event.target as HTMLElement)) {

      this.close()

    }

  }

}