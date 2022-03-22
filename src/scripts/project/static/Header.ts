import Module from "library:modules/Module";
import { query } from "library:utils/dom/query";
import CanvasBranch from "project:routes/HomeRoute/CanvasBranch";

class HeaderElement {

  private ru: string = ''
  private en: string = ''
  private by: string = ''

  constructor(public readonly htmlElement: HTMLElement) {

    this.ru = this.htmlElement.getAttribute('data-ru') || ''
    this.by = this.htmlElement.getAttribute('data-by') || ''
    this.en = this.htmlElement.getAttribute('data-en') || ''

  }


  public switchLanguage(lang: 'en' | 'ru' | 'by') {

    this.htmlElement.innerText = this[lang]

  }

}


class HeaderImageElement extends HeaderElement {

  constructor(htmlElement: HTMLElement) {

    super(htmlElement)

  }


  public switchLanguage(lang: 'en' | 'ru' | 'by') {

    this.htmlElement.style.opacity = '0'

    setTimeout(() => {
      (this.htmlElement as HTMLImageElement).src = this[lang];
      (this.htmlElement as HTMLImageElement).onload = () => {
        this.htmlElement.style.opacity = '1'
      };
    }, 1000)

  }

}


export default class Header {

  public logo?: HeaderElement
  public logoLink?: HTMLElement
  public quizLinkName?: HeaderElement
  public devLink?: HeaderElement
  public navigators?: Array<HeaderElement>
  private currentLang: string = ''

  constructor() {

    this.initializeLogo()
    this.initializeNavigation()
    this.initializeQuizLinkName()
    this.initializeDevLink()

  }


  private initializeLogo() {

    query('.header__logo-link', (el) => {

      this.logoLink = el

      this.logoLink.addEventListener('click', () => {

        if (document.documentElement.classList.contains('categories-in')) {

          document.documentElement.classList.remove('categories-in')

          setTimeout(() => {
            document.documentElement.classList.remove('intro-out')
            if (Module.fastAccess.homeBranch) {
              (Module.fastAccess.homeBranch as CanvasBranch).inYears();
              (Module.fastAccess.homeBranch as CanvasBranch).showBackground()
            }
          }, 800)

        } else {

          document.documentElement.classList.remove('categories-in')

          if (Module.fastAccess.homeBranch) {
            (Module.fastAccess.homeBranch as CanvasBranch).inYears()
          }

        }


      })

    })


    query('.header__logo', (el) => {

      this.logo = new HeaderImageElement(el)

    })

  }


  private initializeNavigation() {

    query('.header__navigation', navigationEl => {

      query('.header__navigation__link', linkEl => {

        if (!this.navigators) {
          this.navigators = []
        }

        this.navigators.push(new HeaderElement(linkEl))

      })

      const showNavigation = () => {

        navigationEl.classList.add('active')
        setTimeout(() => addEventListener('click', hideNavigation), 0)

      }

      const hideNavigation = () => {

        navigationEl.classList.remove('active')
        removeEventListener('click', hideNavigation)

      }

      query('.header__navigation__toggle', toggleEl => {

        toggleEl.addEventListener('click', showNavigation)

      })

    })

  }


  private initializeQuizLinkName() {

    query('.header__quiz-link__name', (el) => {

      this.quizLinkName = new HeaderElement(el)

    })

  }


  private initializeDevLink() {

    query('.header__dev-link', (el) => {

      this.devLink = new HeaderElement(el)

    })

  }


  public switchLanguage(lang: 'ru' | 'en' | 'by') {

    if (this.currentLang === lang) return;

    this.currentLang = lang

    this.logo?.switchLanguage(lang)
    this.navigators?.forEach(navigator => {
      navigator.switchLanguage(lang)
    })
    this.quizLinkName?.switchLanguage(lang)
    this.devLink?.switchLanguage(lang)

  }

}