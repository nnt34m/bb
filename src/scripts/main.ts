import routerStarter from "library:starters/routerStarter";
import HomeRoute from "project:routes/HomeRoute";
import MoneyRoute from "project:routes/MoneyRoute";
import TechnologiesRoute from "project:routes/TechnologiesRoute";
import AchievementsRoute from "project:routes/AchievementsRoute";
import QuizRoute from "project:routes/QuizRoute";
import LanguageRoute from "project:routes/LanguageRoute";
import { query } from "library:utils/dom/query";
import Canvas from "library:modules/WGL/Three/Canvas";
import Camera from "library:modules/WGL/Three/Camera";
import state from 'project:state.json'
import Header from "project:static/Header";
import loader from "library:modules/WGL/Three/loader";
import { Fog, FogExp2, TextureLoader } from "three";
import { ScreenAlert } from "project:static/ScreenAlert";
import { elquery } from "library:utils/dom/elquery";
import store from "project:store";


routerStarter({

  projectName: 'BELARUSBANK',
  projectConfiguration: state,

  callback: (root, router) => {

    // ROUTES

    const languages = ['en', 'ru', 'by']

    const languageRoute = new LanguageRoute()
    router.add(languageRoute)

    languages.forEach(lang => {

      const homeRoute = new HomeRoute(lang)
      const moneyRoute = new MoneyRoute(lang)
      const technologiesRoute = new TechnologiesRoute(lang)
      const achievementsRoute = new AchievementsRoute(lang)
      const quizRoute = new QuizRoute(lang)
      router.add(homeRoute)
      router.add(moneyRoute)
      router.add(technologiesRoute)
      router.add(achievementsRoute)
      router.add(quizRoute)

    })


    // CANVAS

    query('.canvas', (el) => {

      const canvas = new Canvas({
        body: el,
        renderer: {
          alpha: true,
          antialias: true,

        }
      })

      loader.addLoader('textureLoader', TextureLoader)
      canvas.add(new Camera({
        settings: {
          far: 4000,
        }
      }))

      root.add(canvas)

    })


    let screenAlert: ScreenAlert | null = null
    query('.screen-alert', (cel) => {
      elquery(cel, '.screen-alert__description', (del) => {
        elquery(cel, '.screen-alert__icon__use', (iel) => {
          screenAlert = new ScreenAlert(cel, del, iel)
        })
      })
    })

    const header = new Header()
    router.onLanguageChange = lang => {
      header.switchLanguage(lang as 'en' | 'ru' | 'by')
      screenAlert?.switchLanguage(lang as 'en' | 'ru' | 'by')
    }

    root.launch()

    document.documentElement.classList.add('ready')
    setTimeout(() => {
      document.documentElement.classList.add('ready-t')
    }, 100);

  }
})