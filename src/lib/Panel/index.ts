import { MainPanel } from './main'
import { TimePanel } from './time'
import { AxisPanel } from './axis'
import { Panel, PanelConstructor, Sizeable } from 'easy-kline'

export {
    MainPanel, TimePanel, AxisPanel
}

/*
 * 单纯是个UI容器
 */
export class RowContainer<T extends Panel, U extends Panel> implements Sizeable {
    el: HTMLElement
    h: number
    w: number
    mainPanel: T
    axisPanel: U

    constructor(w: number, h: number, mainPanel: PanelConstructor<T>, axisPanel: PanelConstructor<U>) {
        this.w = w
        this.h = h

        // 主区域宽度。占比97%
        const mainW = Math.floor(w * 0.97)
        // y轴宽度。占比3%
        const yAxisW = w - mainW

        // TODO 主面板和轴面板必须要建立关系
        this.mainPanel = new mainPanel(mainW, h)
        this.axisPanel = new axisPanel(yAxisW, h)
    }

    render(): HTMLElement {
        const tr = document.createElement('tr')

        tr.append(this.mainPanel.render(), this.axisPanel.render())

        this.el = tr
        return tr
    }
}
