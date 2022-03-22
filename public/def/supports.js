~function() {

  var gridSupport = typeof document.documentElement.style.grid === 'string'
  if(gridSupport) return;

  var el = document.createElement('div')

  el.className = 'supports'
  el.ariaRoleDescription = 'presentation'

  var text = {
    en: '<div class="supports__title"> Your browser is too old to view the contents of this page,<br>update it or install one of the suggested below </div> <div class="supports__links"><a class="supports__link" href="https://www.google.com/intl/ru/chrome/" target="_blank">Chrome</a><a class="supports__link" href="https://www.mozilla.org/ru/firefox/new/" target="_blank">Firefox</a></div>',
    ru: '<div class="supports__title"> Ваш браузер устарел и не поддерживает новые возможности, <br>обновите его, либо установите один из предложенных ниже </div> <div class="supports__links"><a class="supports__link" href="https://www.google.com/intl/ru/chrome/" target="_blank">Chrome</a><a class="supports__link" href="https://www.mozilla.org/ru/firefox/new/" target="_blank">Firefox</a></div>',
  }

  // @ts-ignore
  el.innerHTML = text[document.documentElement.lang] || text.en

  var style = document.createElement('style')
  style.innerHTML = '.supports { font-family: sans-serif; z-index: 100; position: fixed; top: 0; left: 0; height: 100%; width: 100%; display: flex; justify-content: center; align-items: center; flex-direction: column; background-color: black; color: white; } .supports.active { display: flex; } .supports__title { font-size: 1.5vw; text-align: center; } .supports__links { margin-top: 2vw; } .supports__link { position: relative; font-size: 2vw; font-weight: 500; transition: opacity 0.3s; } .supports__link:not(:last-child) { margin-right: 2vw; } .supports__link::after { content: ""; position: absolute; left: 0; bottom: 0; height: 0.15vw; width: 100%; background-color: black; } .supports__link:hover { opacity: 0.5; } @media (max-width: 1024px) { .supports__title { width: 90%; font-size: 2.5vw; } .supports__links { margin-top: 4vw; } .supports__link { font-size: 3vw; } }'

  document.head.appendChild(style)
  document.body.appendChild(el)

}()
