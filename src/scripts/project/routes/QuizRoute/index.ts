import Route from "library:modules/Router/Route";
import Form from "./Form";
import questionsData from "../../../../data/quiz.json";
import shuffle from "library:utils/array/shuffle";
import { query } from "library:utils/dom/query";
import Modal from "library:tools/Modal";

export default class QuizRoute extends Route {

  private questionsAmount = 10
  private form?: Form
  private container?: HTMLElement
  private startButton?: HTMLElement
  private restartButton?: HTMLElement
  private rightAnswersElement?: HTMLElement
  private questionsAmountElement?: HTMLElement
  private resultRescriptions?: Array<HTMLElement>

  constructor(language: string) {

    super({
      name: `/${language}/quiz`,
      settings: {
        easing: 'easeInOutCubic',
        duration: 500
      }
    })

  }


  public onLaunch() {

    this.container = document.querySelector('.quiz') as HTMLElement
    this.startButton = document.querySelector('.start-button') as HTMLElement
    this.restartButton = document.querySelector('.result-restart-button') as HTMLElement

    this.rightAnswersElement = document.querySelector('.result-right-answers') as HTMLElement
    this.questionsAmountElement = document.querySelector('.result-questions-amount') as HTMLElement

    this.resultRescriptions = [...document.querySelectorAll('.result-description')] as Array<HTMLElement>

    this.listenStartButton()
    this.listenRestartButton()

    query('[data-modal]', (el) => {
      new Modal({
        container: el,
        closeDuration: 500,
      })
    })

  }


  private listenStartButton() {

    this.startButton?.addEventListener('click', () => {
      this.container?.classList.add('form-stage')
      this.createForm()
    })

  }


  private listenRestartButton() {

    this.restartButton?.addEventListener('click', () => {
      this.container?.classList.remove('form-stage')
      this.container?.classList.remove('result-stage')
      this.createForm()
    })

  }


  private createForm() {

    if (this.form) this.form.destroy()

    const pick = []

    const shuffledData = shuffle(questionsData)
    for (let index = 0; index < Math.min(shuffledData.length, this.questionsAmount); index++) {

      const element = shuffledData[index];
      const question = element.question[this.lang as 'en' | 'ru' | 'by']
      const answers = element.answers.map(answer => ({ text: answer[this.lang as 'en' | 'ru' | 'by'], isRight: answer.isRight }))

      pick.push({
        question,
        answers
      })

    }

    this.form = new Form(pick, this.onFormEnd)

  }


  private onFormEnd = (right: number, total: number) => {

    this.rightAnswersElement && (this.rightAnswersElement.innerText = right.toString())
    this.questionsAmountElement && (this.questionsAmountElement.innerText = total.toString())

    this.container?.classList.remove('form-stage')
    this.container?.classList.add('result-stage')

    this.manageResultDescriptions(right)

  }


  private manageResultDescriptions(right: number) {

    this.resultRescriptions?.forEach(desc => desc.classList.remove('active'))

    let activeDescription: HTMLElement | null | undefined = null

    if (right <= 5) {
      activeDescription = this.resultRescriptions?.[0]
    } else if (right > 5 && right <= 8) {
      activeDescription = this.resultRescriptions?.[1]
    } else if (right > 8) {
      activeDescription = this.resultRescriptions?.[2]
    }

    activeDescription?.classList.add('active')

  }


  public onInTransitonStart() {

    document.documentElement.classList.remove('quiz-out')
    document.documentElement.classList.add('quiz-in')

  }


  public onInTransitonEnd() {

    document.documentElement.classList.remove('quiz-out')
    document.documentElement.classList.add('quiz-in-end')

  }


  public onOutTransitonStart() {

    document.documentElement.classList.remove('quiz-in')
    document.documentElement.classList.remove('quiz-in-end')
    document.documentElement.classList.add('quiz-out')

  }


  public onOutTransitonEnd() {

    document.documentElement.classList.remove('quiz-in')
    document.documentElement.classList.remove('quiz-in-end')
    document.documentElement.classList.remove('quiz-out')

  }

}