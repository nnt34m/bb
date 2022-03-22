class Answer {

  public readonly input: HTMLInputElement
  public readonly label: HTMLElement

  constructor(

    public readonly text: string,
    public readonly isRight: boolean,
    public readonly container: HTMLElement

  ) {

    this.label = document.createElement('label')
    this.label.className = 'form-answer'

    const name = document.createElement('span')
    name.className = 'form-answer-name'
    name.innerText = this.text

    this.input = document.createElement('input')
    this.input.type = 'radio'
    this.input.name = 'form-answer'
    this.input.className = 'form-answer-input'
    this.input.checked = true

    this.label.appendChild(this.input)
    this.label.appendChild(name)

    this.container.appendChild(this.label)

  }

}


export default class Form {

  private submitter?: HTMLElement
  private question?: HTMLElement
  private answersContainer?: HTMLElement

  private currentQuestionNumber?: HTMLElement
  private totalQuestionNumber?: HTMLElement

  private answers: Array<Answer> = []
  private questionsCounter = -1
  private rightAnswersCounter = 0
  private initialized: boolean = false
  private wait: boolean = false

  constructor(
    public readonly data: Array<{ question: string, answers: Array<{ text: string, isRight: boolean }> }>,
    public readonly endCallback: Function
  ) {

    this.findParts()
    this.listen()
    this.next()

  }


  private findParts() {

    this.submitter = document.querySelector('.form-submitter') as HTMLElement
    this.question = document.querySelector('.form-question') as HTMLElement

    this.answersContainer = document.querySelector('.form-answers') as HTMLElement

    this.currentQuestionNumber = document.querySelector('.form-current-question-number') as HTMLElement
    this.totalQuestionNumber = document.querySelector('.form-total-question-number') as HTMLElement

  }


  private listen() {

    this.submitter?.addEventListener('click', this.next)

  }


  private unlisten() {

    this.submitter?.removeEventListener('click', this.next)

  }


  private next = () => {

    if (this.wait) return

    this.answers.forEach(answer => {

      if (answer.isRight) {
        answer.label.classList.add('correct')
      } else {
        answer.label.classList.add('incorrect')
      }

    })


    this.initialized && setTimeout(() => {

      this.answers.forEach(answer => {
        answer.label.classList.remove('fade-in')
      })

      this.question?.classList.remove('fade-in')

    }, 500)


    setTimeout(() => {

      this.questionsCounter++

      if (this.answers) {
        this.rightAnswersCounter += this.answers.find(answer => answer.input.checked && answer.isRight) ? 1 : 0
      }

      if (this.questionsCounter === this.data.length) {

        this.endCallback(this.rightAnswersCounter, this.data.length)

      } else {

        this.createAnswers()
        this.createQuestion()
        this.setCurrent()

      }

      this.wait = false

    }, this.initialized ? 1000 : 0)

    if (this.initialized) this.wait = true

    this.initialized = true

  }


  private createQuestion() {

    const item = this.data[this.questionsCounter]
    this.question && (this.question.innerText = item.question)
    this.question?.classList.add('fade-in')

  }


  private createAnswers() {

    const item = this.data[this.questionsCounter]

    if (this.answersContainer) {

      this.answersContainer.innerHTML = ''
      this.answers = []

      item.answers.forEach(answer => {

        this.answers?.push(
          new Answer(
            answer.text,
            answer.isRight,
            this.answersContainer!,
          )
        )

      })

      setTimeout(() => {
        this.answers.forEach(answer => answer.label.classList.add('fade-in'))
      }, 100)

      this.setTotal()

    }

  }


  private setTotal() {

    this.totalQuestionNumber && (this.totalQuestionNumber.innerText = this.data.length.toString())

  }


  private setCurrent() {

    this.currentQuestionNumber && (this.currentQuestionNumber.innerText = (this.questionsCounter + 1).toString())

  }


  public destroy() {

    this.unlisten()

  }

}