import MOCK_DATA from '../data.json'
import { DEFAULT_CONFIG, DEFAULT_SIZING } from './constants'
import { EasyDataAdapter, EasyKlineConfig, FixedUnit, SymbolConfig, Unit } from 'easy-kline'
import { assign } from 'lodash'

import { MainPanel, TimePanel, Panel } from './lib/Panel/base'

/**
 * y轴映射
 */
interface YAxisMapping {
    (o: number): number
}

/**
 * 布局行
 */
interface LayoutRowInfo {
    W0: number
    W1: number
    H: number
}

class EasyKline {
    el: HTMLElement
    config: EasyKlineConfig
    symbolConfig: SymbolConfig
    adapter: EasyDataAdapter
    panels: Panel[]
    // 缩放量：由滚动事件计算修改
    scale: number
    // 位移量：由拖拽事件计算修改
    movement: number
    // 原始数据：有adapter得到
    data: FixedUnit[]
    // 窗口数据：由movement和scale计算得到当前展示用数据
    windowData: FixedUnit[]
    // y轴映射关系：输入原始值，输出实际的y轴位置或长度
    yAxisMapping: YAxisMapping
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
        adapter.load(symbol, this.dataInit.bind(this))
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

        this.panels = [
            // K线面板
            new MainPanel(containerW, mainH),
            // 成交量面板
            new MainPanel(containerW, minorH),
            // 时间轴面板
            new TimePanel(containerW, xAxisH)
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
     */
    broadcastData() {
        const { data } = this
        const range = [0, Infinity]
        // 得到当前数据的范围信息
        data.forEach((k) => {
            let max = Math.max(k.high, k.open, k.low, k.close)
            let min = Math.min(k.high, k.open, k.low, k.close)
            if (max > range[0]) {
                range[0] = max
            }

            if (min < range[1]) {
                range[1] = min
            }
        })

        this.panels.forEach(p => {
            p.dataReceiver(data)
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
    dataInit(symbolConfig: SymbolConfig) {
        const { adapter, interval } = this.config
        const fixedInterval = interval * 1000
        this.symbolConfig = symbolConfig

        // 主窗口的尺寸
        const { w, h } = this.panels[0]
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
