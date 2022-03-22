import { types } from "@theatre/core";
import breakpointer from "library:autonomous/breakpointer";
import resizer from "library:autonomous/resizer";
import state from "library:autonomous/state";
import Cluster, { ClusterParameters } from "library:autonomous/state/Cluster";
import { LayerParameters } from "library:autonomous/state/Layer";
import { SubscriptionCallback } from "library:autonomous/state/Unit";
import ticker from "library:autonomous/ticker";
import { KV } from "library:types";
import randomId from "library:utils/random/randomId";

export type ModuleSettings = { off: 'no' | 'soft' | 'hard' | 'softResize' | 'hardResize' | 'default' }

export type RecompileMode = 'soft' | 'hard' | 'softResize' | 'hardResize' | 'default' | 'no'

export default class Module<
  Settings extends KV = any,
  Parent extends Module = Module<any, any, any>,
  Children extends Module = Module<any, any, any>
  > {

  public static fastAccess: KV<Module> = {}

  public readonly id = randomId()
  public name: string = 'unnamed'
  public type: string = 'untyped'
  public layer: string = 'undefined'

  public parent?: Parent
  public children: Array<Children> = []
  private conservation: Array<Children> = []

  public readonly indicators = {
    launched: false,
    destroyed: false,
    inaccessible: false,
    usingTick: false,
    usingResize: false,
  }

  public autoTick = true
  public autoResize = true
  public launchChildren = true
  public configuration?: Cluster<Settings & ModuleSettings>
  private rejectLaunch?: Function | null

  constructor() {

    if (this.onTick) this.onTick = this.onTick.bind(this)
    if (this.onResize) this.onResize = this.onResize.bind(this)
    if (this.onAfterResize) this.onAfterResize = this.onAfterResize.bind(this)
    if (this.onBreakpointChange) this.onBreakpointChange = this.onBreakpointChange.bind(this)

  }

  public onBeforeLaunch?(res: (data?: any) => void, rej: (reason?: any) => void): void
  public onLaunch?(): void
  public onAdding?(module: Module): void
  public onRemoving?(module: Module): void
  public onAfterLaunch?(): void
  public onConservation?(): void
  public onBreakpointChange?(newBreakpoint?: string, oldBreakpoint?: string): void
  public onSettingsChange?(currentValues: Settings & ModuleSettings, previousValues: Settings & ModuleSettings): void
  public onResize?(): void
  public onAfterResize?(): void
  public onTick?(t: number): void
  public onLaunchError?(error: any): void
  public onReset?(): void
  public onMessageReceive?(title: string, content: any): void


  public add(module: Children, recompile?: RecompileMode) {

    if ([...this.children, ...this.conservation].find(child => child.id === module.id)) return;

    if (module.name && module.name !== 'unnamed') {
      Module.fastAccess[module.name] = module
    }

    module.parent = this
    module.configuration && module.subscribeToConfiguration()


    if (this.indicators.launched) {

      this.children.push(module)
      module.launch(recompile)

    } else {

      this.conservation.push(module)

    }

    this.onAdding?.(module)

  }


  public remove(module: Children, recompile?: RecompileMode) {

    module.unsubscribeFromConfiguration()

    if (this.children) {

      this.children = this.children.filter(child => child.id !== module.id)
      this.conservation = this.conservation.filter(c => c.id !== module.id)

    }

    module.indicators.launched && module.conserve(recompile)
    module.parent = undefined

    this.onRemoving?.(module)

  }


  public eachChild<T extends Children = Children>(callback: (module: T, index: number, parent: Array<Children>) => void, checkConservationToo = false) {

    if (checkConservationToo) {
      [...this.children, ...this.conservation].forEach((module, index, parent) => callback(module as T, index, parent))
    } else {
      this.children.forEach((module, index, parent) => callback(module as T, index, parent))
    }

  }


  public findChildByName(name: string, checkConservationToo = false) {

    if (checkConservationToo) {
      return [...this.children, ...this.conservation].find(child => child.name === name)
    } else {
      return this.children.find(child => child.name === name)
    }

  }


  public findChildrenByName(name: string, checkConservationToo = false) {

    if (checkConservationToo) {
      return [...this.children, ...this.conservation].filter(child => child.name === name)
    } else {
      return this.children.filter(child => child.name === name)
    }

  }


  public findChildrenByType(type: string, checkConservationToo = false) {

    if (checkConservationToo) {
      return [...this.children, ...this.conservation].filter(child => child.type === type)
    } else {
      return this.children.filter(child => child.type === type)
    }

  }


  public traverse(callback: (module: Module) => void) {

    callback(this)

    this.children.forEach((module) => {

      if (module.children) {

        module.traverse(callback)

      } else {

        callback(this)

      }

    })

  }


  public traverseBack(callback: null | ((module: Module) => void), onRoot?: (module: Module) => void) {

    if (this.parent) {

      callback && callback(this.parent)
      this.parent.traverseBack(callback, onRoot)

    } else {

      onRoot?.(this)

    }

  }


  public async launch(recompile?: RecompileMode) {

    if (recompile && recompile !== 'default' && recompile !== 'no' && this.parent && this.parent.indicators.launched) {
      return this.recompile(recompile, true)
    }

    if (this.indicators.launched || this.configuration?.value.off && this.configuration?.value.off !== 'no') return;

    if (this.onBeforeLaunch) {

      try {

        await new Promise<any>((res, rej) => {
          this.rejectLaunch = rej
          this.onBeforeLaunch?.(res, rej)
        })

        this.launchSteps()

      } catch (error) {

        this.launchError(error)
        return

      }

    } else {

      this.launchSteps()

    }

    this.onAfterLaunch?.()

  }


  private launchSteps() {

    if (this.name && this.name !== 'unnamed') {
      Module.fastAccess[this.name] = this
    }

    this.onLaunch?.()

    if (this.launchChildren) {

      this.children = this.conservation
      this.conservation = []

      this.eachChild(module => {
        !module.indicators.inaccessible && module.launch()
      })
    }

    this.indicators.launched = true
    this.useSpecialMethods()

  }


  private useSpecialMethods() {

    if (this.autoResize && !this.indicators.usingResize && (this.onResize || this.onAfterResize)) {
      this.useResize()
    }

    if (this.autoTick && !this.indicators.usingTick && this.onTick) {
      this.useTick()
    }

    if (this.indicators.usingResize && this.onResize) {
      resizer.markToResize(this.onResize, 'before')
    }

    if (this.indicators.usingResize && this.onAfterResize) {
      resizer.markToResize(this.onAfterResize, 'after')
    }

  }


  private launchError(error: any) {

    this.indicators.launched = false
    this.onLaunchError?.(error)
    this.rejectLaunch = null

  }


  public conserve(recompile?: RecompileMode) {

    if (!this.indicators.launched) return;
    this.indicators.launched = false


    if (this.rejectLaunch) this.rejectLaunch('interrupted from conserve method')

    if (this.name && this.name !== 'unnamed') {
      delete Module.fastAccess[this.name]
    }

    if (this.indicators.usingResize && this.onResize) {
      resizer.unmarkToResize(this.onResize, 'before')
    }

    if (this.indicators.usingResize && this.onAfterResize) {
      resizer.unmarkToResize(this.onAfterResize, 'after')
    }

    this.unuseResize()
    this.unuseTick()
    this.onReset?.()

    this.onConservation?.()

    this.eachChild(module => module.conserve())
    this.conservation = this.children
    this.children = []

    if (recompile && recompile !== 'default') {

      this.indicators.inaccessible = true
      this.recompile(recompile)
      this.indicators.inaccessible = false
    }

  }


  public recompile(mode: RecompileMode, fromLaunch = false) {

    if (mode === 'soft' && this.parent) {

      this.parent.conserve()
      this.parent.launch()

    }

    else if (mode === 'hard') {

      this.traverseBack(null, root => {

        if (root.id !== this.id) {
          root.conserve()
          root.launch()
        }

      })

    }

    else if (mode === 'softResize') {

      fromLaunch && this.launch()
      this.parent?.useSpecialMethods()

    }

    else if (mode === 'hardResize') {

      fromLaunch && this.launch()

      this.traverseBack(null, root => {

        root.traverse((module) => {

          if (module !== this) {
            module.useSpecialMethods()
          }

        })

      })

    }

  }


  public removeSelf(mode?: RecompileMode) {

    this.parent?.remove(this, mode)

  }


  public useResize(invokeImmediately = false) {

    if (this.onResize) {
      resizer.add(this.onResize, 'before', invokeImmediately)
    }

    if (this.onAfterResize) {
      resizer.add(this.onAfterResize, 'after', invokeImmediately)
    }

    this.indicators.usingResize = true

  }


  public unuseResize() {

    if (this.onResize) {
      resizer.remove(this.onResize, 'before')
    }

    if (this.onAfterResize) {
      resizer.remove(this.onAfterResize, 'after')
    }

    this.indicators.usingResize = false

  }


  public useTick(position: number = 0) {

    if (this.onTick && !this.indicators.usingTick) {
      ticker.add(this.onTick, position)
      this.indicators.usingTick = true
    }

  }


  public unuseTick() {

    if (this.onTick && this.indicators.usingTick) {
      ticker.remove(this.onTick)
      this.indicators.usingTick = false
    }

  }


  public useBreakpoints(breakpoint: Array<string>, invokeImmediately = false) {

    if (this.onBreakpointChange) {
      breakpointer.add(this.onBreakpointChange, breakpoint, invokeImmediately)
    }

  }


  public unuseBreakpoints() {

    if (this.onBreakpointChange) {
      breakpointer.remove(this.onBreakpointChange)
    }

  }


  public useConfiguration(settings: { [key in keyof (Settings & Partial<ModuleSettings>)]: any }, breakpoints: Array<string> = []) {

    for (const key in settings) {

      if (Object.prototype.hasOwnProperty.call(settings, key)) {

        if (key.startsWith('_')) {
          delete settings[key]
        }

      }

    }

    this.configuration = this.useCluster<ModuleSettings & Settings>({
      layerName: this.layer,
      layerInstanceID: 'default',
      clusterName: this.name.replace('/', ''),
      breakpoints: breakpoints,
      settings: {
        off: types.stringLiteral('no', { no: 'no', soft: 'soft', hard: 'hard', softResize: 'softResize', hardResize: 'hardResize', default: 'default', }),
        ...settings
      }
    })

  }


  private subscribeToConfiguration() {

    if (this.configuration) {
      this.configuration.subscribe(this.handleSettingsChange as SubscriptionCallback)
    }

  }


  private unsubscribeFromConfiguration() {

    if (this.configuration) {
      this.configuration.unsubscribe(this.handleSettingsChange as SubscriptionCallback)
    }

  }


  private handleSettingsChange = (currentValues: Settings & ModuleSettings, previousValues: Settings & ModuleSettings) => {

    if (!Object.keys(previousValues).length) return;

    if (previousValues.off !== 'no' && currentValues.off === 'no' && !this.indicators.launched) {

      this.launch(previousValues.off as RecompileMode)
      return

    }

    else if (currentValues.off !== 'no' && this.indicators.launched) {

      this.conserve(currentValues.off as RecompileMode)
      return

    }


    if (this.indicators.launched) {

      this.onSettingsChange?.(currentValues, previousValues)

    }

  }


  public useCluster<T>(parameters: ClusterParameters<T> & LayerParameters) {

    return state.getCluster(parameters)

  }


  public sendMessageToModule(moduleName: string, title: string, content?: any) {

    if (Module.fastAccess[moduleName]) {

      Module.fastAccess[moduleName].receiveMessage(title, content)

    }

  }


  public sendMessageToAncestors(title: string, content?: any) {

    this.traverseBack((module) => {

      module.receiveMessage(title, content)

    })

  }


  public sendMessageToParent(title: string, content?: any) {

    if (this.parent) {

      this.parent.receiveMessage(title, content)

    }

  }


  public sendMessageToChildren(title: string, content?: any) {


    this.eachChild((module) => {

      module.receiveMessage(title, content)

    })

  }


  public sendMessageToDescendants(title: string, content?: any) {


    this.traverse((module) => {

      module.receiveMessage(title, content)

    })

  }


  private receiveMessage(title: string, content?: any) {

    this.onMessageReceive?.(title, content)

  }

}