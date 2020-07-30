import data from '../data.json'
import Panel from './lib/Panel'
import { DEFAULT_CONFIG } from './constants'
import { EasyDataAdapter, EasyKlineConfig, FixedUnit, Unit } from 'easy-kline'
import { assign } from 'lodash'
import { create } from './lib/layout'
import { createRow, createTable } from './utils/dom'

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
    config: EasyKlineConfig
    container: HTMLElement
    adapter: EasyDataAdapter
    panels: Panel[]
    // 缩放量：由滚动事件计算修改
    scale: number
    // 位移量：由拖拽事件计算修改
    movement: number
    // 原始数据：有adapter得到
    data: Unit[]
    // 窗口数据：由movement和scale计算得到当前展示用数据
    windowData: FixedUnit[]
    // y轴映射关系：输入原始值，输出实际的y轴位置或长度
    yAxisMapping: YAxisMapping
    // 布局信息：W0 W1 H0 H1 H2
    layoutInfo: LayoutRowInfo[]

    constructor(config: EasyKlineConfig) {
        const { el, adapter } = config
        // 配置阶段
        this.config = assign(DEFAULT_CONFIG, config)
        this.adapter = adapter

        this.layout(el)

        // 初始化基本的DOM结构
        this.panels = create(this.container)

        // 初始化基本的事件系统
        this.bindEvent()
    }

    /**
     * 布局DOM
     */
    layout(el: HTMLElement) {
        const containerW = el.clientWidth,
            containerH = el.clientHeight
        const table = createTable(containerW, containerH)

        // 主区域宽度。占比97%
        const mainW = Math.floor(containerW * 0.97)
        // y轴宽度。占比3%
        const yAxisW = containerW - mainW
        // x轴高度。固定20px
        const xAxisH = 20
        // 主区域高度。占比74
        const mainH = Math.floor(containerH * 0.74)
        // 副区域高度。
        const minorH = containerH - xAxisH - mainH
        const Hs = [mainH, minorH, xAxisH]
        const rows: LayoutRowInfo[] = []
        Hs.forEach((h) => {
            rows.push({
                W0: mainW,
                W1: yAxisW,
                H: h
            })
        })
        rows.forEach((r) => {
            const dataPanel = new BasePanel(r.W0, r.H)
            const axisPanel = new BasePanel(r.W1, r.H)
            const row = createRow(r.W0, r.W1, r.H, dataPanel.el, axisPanel.el)
            table.append(row)
        })
        this.layoutInfo = rows

        el.append(table)
    }

    bindEvent() {
        const container = this.container

        container.addEventListener('mousemove', (e) => {
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
        this.panels.forEach((p) => {})
    }

    /**
     * 向各个panel广播数据
     */
    broadcastData() {}
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

// @ts-ignore
window.kline = kline
