import MOCK_DATA from '../data.json'
import { DEFAULT_CONFIG, DEFAULT_SIZING } from './constants'
import { EasyDataAdapter, EasyKlineConfig, FixedUnit, SymbolConfig, Unit } from 'easy-kline'
import { assign } from 'lodash'
import { MainPanel, TimePanel, Panel } from './lib/Panel'

export class EasyKline {
    el: HTMLElement
    config: EasyKlineConfig
    symbolConfig: SymbolConfig
    adapter: EasyDataAdapter
    mainPanel: Panel
    timePanel: Panel
    panels: Panel[]
    // 缩放量：由滚动事件计算修改
    scale: number
    // 位移量：由拖拽事件计算修改
    movement: number
    // 原始数据：有adapter得到，全量数据
    data: FixedUnit[]
    // 窗口数据：由movement和scale计算得到当前展示用数据
    windowData: FixedUnit[]
    readyCallbacks: Set<Function>

    constructor(config: EasyKlineConfig) {
        // 配置阶段
        this.config = assign(DEFAULT_CONFIG, config)

        this.readyCallbacks = new Set()

        // 默认没有缩放和移动
        this.scale = 1
        this.movement = 0
        this.data = []

        // 初始化组件内部关系
        this.init()

        // 初始化基本的事件系统
        this.bindEvent()

        this.render()

        // 必须要要有异步的内容，否则onReady注册不上了就
        const { adapter, symbol } = this.config
        // 拉取产品配置
        adapter.load(symbol, this.loadAdapter.bind(this))
    }

    /**
     * 初始化程序关系
     * @private
     */
    private init() {
        const { el } = this.config
        const containerW = el.clientWidth,
            containerH = el.clientHeight

        // x轴高度。固定20px
        const xAxisH = 20
        // 主区域高度。占比74
        const mainH = Math.floor(containerH * 0.74)
        // 副区域高度。
        const minorH = containerH - xAxisH - mainH

        this.mainPanel = new MainPanel(containerW, mainH, this)
        this.timePanel = new TimePanel(containerW, xAxisH, this)

        this.panels = [
            // K线面板
            this.mainPanel,
            // 成交量面板
            new MainPanel(containerW, minorH, this),
            // 时间轴面板
            this.timePanel
        ]
    }

    /**
     * 初始化事件系统
     */
    bindEvent() {
        const { el } = this.config

        el.addEventListener('mousemove', (e) => {
            const position = {
                x: e.offsetX,
                y: e.offsetY
            }

            this.broadcastEvent('position', position)
        })
    }

    /**
     * 广播事件
     * @param eventName 事件名称
     * @param payload 事件参数
     */
    broadcastEvent(eventName: string, payload: any) {
        this.panels.forEach((p) => {
            p.update(eventName, payload)
        })
    }

    /**
     * 向各个panel广播数据
     * 拉取全量数据后
     * scale缩放变化
     * movement用户拖拽
     * 都需要重新广播数据，广播出去的应该是窗口数据
     */
    broadcastData() {
        const { data } = this
        // 理论上这里应该下发窗口数据
        // 主窗口的尺寸，宽度影响具体加载量
        const { w } = this.panels[0]
        // 主窗口最大容纳单位数
        const MAX_UNIT_COUNT = Math.floor(w / DEFAULT_SIZING.UNIT_W_OF_X)

        this.panels.forEach(p => {
            p.dataReceiver(data.slice(0, MAX_UNIT_COUNT))
        })

        this.ready()
    }

    /**
     * 渲染DOM结构
     */
    render() {
        const { el } = this.config
        const table = document.createElement('table')
        const tbody = document.createElement('tbody')

        this.panels.forEach(p => {
            tbody.append(p.render())
        })

        table.append(tbody)
        el.append(table)

        return table
    }

    /**
     * 通知外界ready
     * @param cb
     */
    onReady(cb: Function) {
        this.readyCallbacks.add(cb)
    }

    /**
     * 接收adapter提供的symbol配置
     * @param symbolConfig
     */
    loadAdapter(symbolConfig: SymbolConfig) {
        const { adapter, interval } = this.config
        const fixedInterval = interval * 1000
        this.symbolConfig = symbolConfig

        // TODO 是否需要根据窗口情况请求数据，定量请求，然后根据窗口分发窗口数据
        // 根据interval决定条数

        // 主窗口的尺寸，宽度影响具体加载量
        const { w } = this.panels[0]
        // 主窗口最大容纳单位数
        const MAX_UNIT_COUNT = Math.floor(w / DEFAULT_SIZING.UNIT_W_OF_X)

        const now = Date.now()
        // 根据interval决定拉取数据的范围
        // 当前时刻对应的周期点
        const end = now - (now % fixedInterval)
        const start = end - Math.floor(MAX_UNIT_COUNT * (1 + DEFAULT_SIZING.EXTEND_PERCENT)) * fixedInterval

        // 向adapter拉取数据
        adapter.get(start, end, this.pull.bind(this))
    }

    /**
     * 向adapter拉取数据后，处理并广播
     */
    pull(data: Unit[]) {
        // 简单处理数据
        let newData = data.map<FixedUnit>(unit => {
            return {
                ...unit,
                type: unit.open > unit.close ? 1 : 2
            }
        })

        // 拉取到全部数据
        this.data = this.data.concat(newData)

        // 在这里运算窗口数据

        this.broadcastData()
    }

    ready() {
        this.readyCallbacks.forEach(cb => {
            cb()
        })
    }
}

class Adapter implements EasyDataAdapter {
    count: number
    data: Unit[]

    constructor() {
        this.count = 0
        this.data = MOCK_DATA.reverse()
    }


    load(symbol: string, onLoad: (config: SymbolConfig) => any) {
        setTimeout(() => {
            onLoad({
                symbol,
                pricePlace: 2
            })
        })
    }

    get(start: number, end: number, push: (data: Unit[]) => any) {
        const count = (end - start) / (3600 * 1000)
        this.count += count
        console.log(start, end, this.count)
        push(MOCK_DATA.slice(0, this.count))
    }

    sub(onNew: (unit: Unit | Unit[]) => any): number {
        return 0
    }
}

console.time('EasyKline initialized!')
const kline = new EasyKline({
    el: document.getElementById('main'),
    adapter: new Adapter(),
    symbol: 'cmt_btcusdt',
    interval: 3600 // 一小时
})
kline.onReady(() => {
    console.timeEnd('EasyKline initialized!')
})

// @ts-ignore
window.kline = kline
