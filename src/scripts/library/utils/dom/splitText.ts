export type SplitTextSettings = {
  letters?: boolean
  wordsDelay?: number
  lettersDelay?: number
  lettersStartDelay?: number
  wordsStartDelay?: number
  vars?: boolean
}

type Word = {
  htmlElement: HTMLElement,
  letters: Array<HTMLElement> | string
}

export default function splitText(htmlElement: HTMLElement, settings?: SplitTextSettings) {

  const text = htmlElement.innerText
  const arrayOfWordsStrings = text.split(' ')
  const words: Array<Word> = []
  let lettersCounter = 0

  for (let wordIndex = 0; wordIndex < arrayOfWordsStrings.length; wordIndex++) {

    const word: Word = {
      htmlElement: document.createElement('span'),
      letters: ''
    }

    const wordString = arrayOfWordsStrings[wordIndex]

    if (settings?.letters) {

      word.letters = []

      for (let letterIndex = 0; letterIndex < wordString.length; letterIndex++) {

        const letter = wordString[letterIndex]
        const letterSpan = document.createElement('span')
        letterSpan.innerHTML = letter === ' ' ? '&nbsp;' : letter
        word.letters.push(letterSpan)
        lettersCounter += letter == ' ' ? 0 : 1

      }

    } else {

      word.letters = wordString

    }

    words.push(word)

  }


  if (settings?.wordsDelay) {

    const startDelay = settings.wordsStartDelay || 0

    words.forEach((word, index) => {

      const delay = startDelay + settings.wordsDelay! / (words.length - 1) * index

      if (settings.vars) {
        word.htmlElement.style.setProperty('--delay', `${delay}s`)
      } else {
        word.htmlElement.style.transitionDelay = `${delay}s`
      }
      word.htmlElement.className = `word word_${index + 1}`

    })

  }


  if (settings?.lettersDelay && settings.letters) {

    const startDelay = settings.lettersStartDelay || 0
    let lettersAcc = 0

    words.forEach((word, wordIndex) => {

      lettersAcc += words[wordIndex - 1] ? words[wordIndex - 1].letters.length : 0

      Array.isArray(word.letters) && word.letters.forEach((letter, letterIndex) => {

        if (letter.innerHTML === '&nbsp;') return
        const delay = startDelay + settings.lettersDelay! / (lettersCounter - 1) * (lettersAcc + letterIndex)

        if (settings.vars) {
          letter.style.setProperty('--delay', `${delay}s`)
        } else {
          letter.style.transitionDelay = `${delay}s`
        }

        letter.className = `letter letter_${lettersAcc + letterIndex + 1}`

      })

    })

  }


  htmlElement.innerHTML = ''


  words.forEach((word, index) => {

    if (Array.isArray(word.letters)) {

      word.htmlElement.append(...word.letters)

    } else {

      word.htmlElement.innerText = word.letters

    }

    if (index !== words.length - 1) {

      word.htmlElement.innerHTML += '&nbsp;'

    }

  })


  htmlElement.append(...words.map(word => word.htmlElement))


}