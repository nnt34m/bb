import CategoryRoute from "project:routes/CategoryRoute";

export default class MoneyRoute extends CategoryRoute {

  constructor(language: string) {

    super(`/${language}/money`)

  }

}