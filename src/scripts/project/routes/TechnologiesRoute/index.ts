import CategoryRoute from "project:routes/CategoryRoute";

export default class TechnologiesRoute extends CategoryRoute {

  constructor(language: string) {

    super(`/${language}/technologies`)

  }

}