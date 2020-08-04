import { FixedUnit, Sizeable } from 'easy-kline'
import { DataPencil, UIPencil } from '../Pencil'
import { AxisPanel } from './axis'
import { EasyKline } from '../../index'

export interface Panel extends Sizeable {
    el: HTMLElement
    dataPencil: DataPencil
    uiPencil: UIPencil

    update(eventName: string, payload: any): any

    dataReceiver(data: FixedUnit[]): any

    getAxisInfo(x: number, y: number): [number, number]
}

export class BasePanel implements Panel {
    el: HTMLElement
    h: number
    w: number
    _w: number
    dataPencil: DataPencil
    uiPencil: UIPencil
    axisPanel: AxisPanel
    range: [number, number]
    parent: EasyKline

    constructor(containerW: number, h: number, parent: EasyKline) {
        // 主区域宽度。占比97%
        const mainW = Math.floor(containerW * 0.97)
        // y轴宽度。占比3%
        const yAxisW = containerW - mainW

        this.w = mainW
        this._w = yAxisW
        this.h = h

        // 需要初始化不同的数据画笔
        // this.dataPencil = new DataPencil(mainW, h)
        this.uiPencil = new UIPencil(mainW, h)
        this.uiPencil.setPanel(this)
        this.axisPanel = new AxisPanel(yAxisW, h)

        this.range = [0, Infinity]

        this.parent = parent
    }

    render(): HTMLElement {
        const tr = document.createElement('tr')
        const td = document.createElement('td')
        const wrapper = document.createElement('div')

        wrapper.setAttribute('style', `position:relative;width:${this.w}px;height:${this.h}px`)
        wrapper.append(this.dataPencil.render(), this.uiPencil.render())
        td.append(wrapper)
        tr.append(td, this.axisPanel.render())
        return tr
    }

    dataReceiver(data: FixedUnit[]): any {
    }

    update(eventName: string, payload: any): any {
    }

    getAxisInfo(x: number, y: number): [number, number] {
        return [0, 0]
    }
}
