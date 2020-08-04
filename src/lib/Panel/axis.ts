import { DataPencil, UIPencil } from '../Pencil'
import { Unit } from 'easy-kline'
import { Panel } from './base'

/**
 * 轴面板
 */
export class AxisPanel implements Panel {
    el: HTMLElement
    h: number
    w: number
    dataPencil: DataPencil
    uiPencil: UIPencil

    constructor(w: number, h: number) {
        this.w = w
        this.h = h

        this.dataPencil = new DataPencil(w, h, this)
        this.uiPencil = new UIPencil(w, h)
    }

    render(): HTMLElement {
        const td = document.createElement('td')
        const wrapper = document.createElement('div')

        wrapper.setAttribute('style', `position:relative;width:${this.w}px;height:${this.h}px`)
        wrapper.append(this.dataPencil.render(), this.uiPencil.render())
        td.append(wrapper)
        return td
    }

    update(eventName: string, payload: any): any {
    }

    dataReceiver(data: Unit[]): any {
    }

    getAxisInfo(): any {
    }
}
