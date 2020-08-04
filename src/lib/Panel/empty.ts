import { DataPencil, UIPencil } from '../Pencil'
import { Unit } from "easy-kline"
import { Panel } from './base'

/**
 * 仅布局用，不具有绘图作用
 */
export class EmptyPanel implements Panel {
    el: HTMLElement
    w: number
    h: number
    dataPencil: DataPencil
    uiPencil: UIPencil

    constructor(w: number, h: number) {
        this.w = w
        this.h = h
    }

    render(): HTMLElement {
        const td = document.createElement('td')
        const wrapper = document.createElement('div')

        wrapper.setAttribute('style', 'position:relative;width:100%;height:100%')
        td.append(wrapper)
        return td
    }

    update(eventName: string, payload: any): any {
    }

    dataReceiver(data: Unit[]): any {
    }
}
