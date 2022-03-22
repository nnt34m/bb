export default class Stairs3d {

  steps: Map<string | number, [number, number, number]> = new Map()
  value = { x: 0, y: 0, z: 0 }

  public set(stepName: number | string, x: number = 0, y: number = 0, z: number = 0) {

    this.steps.get(stepName)![0] = x
    this.steps.get(stepName)![1] = y
    this.steps.get(stepName)![2] = z

  }


  public setFromObject(stepName: number | string, object: { x: number, y: number, z: number }) {

    this.steps.get(stepName)![0] = object.x
    this.steps.get(stepName)![1] = object.y
    this.steps.get(stepName)![2] = object.z

  }


  public addStep(stepName: number | string, initialValue = 0) {

    this.steps.set(stepName, [initialValue, initialValue, initialValue])

  }


  public removeStep(stepName: number | string) {

    this.steps.delete(stepName)

  }


  public add() {

    const res = [0, 0, 0]

    this.steps.forEach(step => {

      res[0] += step[0]
      res[1] += step[1]
      res[2] += step[2]

    }, [0, 0, 0])

    this.value.x = res[0]
    this.value.y = res[1]
    this.value.z = res[2]

  }


  public multi() {

    const res = [1, 1, 1]

    this.steps.forEach(step => {

      res[0] *= step[0]
      res[1] *= step[1]
      res[2] *= step[2]

    }, [0, 0, 0])

    this.value.x = res[0]
    this.value.y = res[1]
    this.value.z = res[2]

  }

}