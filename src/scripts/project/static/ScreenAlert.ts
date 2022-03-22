import resizer from "library:autonomous/resizer";
import device from "library:autonomous/device";

export class ScreenAlert {


  private phoneText = {
    ru: 'Поверните устройство горизонтально, чтобы начать',
    en: 'Turn your device horizontally to start',
    by: 'Поверните устройство горизонтально, чтобы начать',
  }


  private desktopText = {
    ru: 'Увеличьте ширину браузера, чтобы начать',
    en: 'Increase browser width to get started',
    by: 'Увеличьте ширину браузера, чтобы начать',
  }


  private icon = {
    desktop: '#sprite-arrows',
    mobile: '#sprite-phone',
  }

  constructor(
    public readonly containerElement: HTMLElement,
    public readonly descriptionElement: HTMLElement,
    public readonly svgUseElement: HTMLElement,
  ) {

    resizer.add(this.check, 'after', true)

    svgUseElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', device.isMobile ? this.icon.mobile : this.icon.desktop)

  }


  private check = () => {

    if (matchMedia('(max-aspect-ratio: 11/9)').matches) {
      this.show()
    } else {
      this.hide()
    }

  }


  private show() {

    this.containerElement.classList.add('active')

  }


  private hide() {

    this.containerElement.classList.remove('active')

  }


  public switchLanguage(lang: 'ru' | 'en' | 'by') {

    this.descriptionElement.innerText = device.isMobile ? this.phoneText[lang] : this.desktopText[lang]

  }

}