import data from '../data.json'
import Panel from './lib/Panel'
import { DEFAULT_SETTING, DEFAULT_UNIT_W, DEFAULT_CONFIG } from './constants'
import { EasyDataAdapter, EasyKlineConfig, Unit, ReadyCallback } from 'easy-kline'
import { assign } from 'lodash'

class EasyKline {
    config: EasyKlineConfig
    container: HTMLElement
    adapter: EasyDataAdapter
    panels: Panel[]
    private readyCbs: ReadyCallback[]

    constructor(config: EasyKlineConfig) {
        // TODO 对config的基础判断
        const { el, adapter } = config
        // 配置阶段
        this.config = assign(DEFAULT_CONFIG, config)

        // 记录容器
        if (typeof el === 'string') {
            this.container = document.getElementById(el)
        } else {
            this.container = el
        }

        this.adapter = adapter
        this.panels = []
        this.readyCbs = []

        this.init()
        this.go()
    }

    init() {
        // 自身结构在这里构造，最终插到el中
        let panel = new Panel(this.container)
        panel.initDataSet(this.adapter.get(0, 1))
        this.addPanel(panel)
    }

    private addPanel(panel: Panel) {
        this.panels.push(panel)
    }

    go() {
        let tasks = this.panels.map<Promise<any>>((p) => p.draw())
        Promise.all(tasks).then((_) => {
            this.ready()
        })
    }

    ready() {
        this.readyCbs.forEach((cb) => cb())
    }

    onReady(cb: ReadyCallback) {
        this.readyCbs.push(cb)
    }
}

class Adapter implements EasyDataAdapter {
    get(start: number, end: number): Unit[] {
        console.log(start, end)
        return data
    }

    sub(onNew: (unit: Unit | Unit[]) => any): number {
        return 0
    }
}

const kline = new EasyKline({
    el: document.getElementById('main'),
    adapter: new Adapter()
})

kline.onReady(() => {
    console.log('+++')
})

// @ts-ignore
window.kline = kline
