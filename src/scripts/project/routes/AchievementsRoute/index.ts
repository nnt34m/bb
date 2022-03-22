import CategoryRoute from "project:routes/CategoryRoute";

export default class AchievementsRoute extends CategoryRoute {

  constructor(language: string) {

    super(`/${language}/achievements`)

  }

}