import { EasyKline, FixedUnit, Panel, Pencil } from 'easy-kline'
import { UIPencil } from '../Pencil'
import { Dep } from '../../utils/dep'

let id = 0

export class BasePanel implements Panel {
    el: HTMLElement
    h: number
    w: number
    dataPencil: Pencil
    uiPencil: UIPencil
    id: number
    parent: EasyKline

    constructor(w: number, h: number) {
        this.w = w
        this.h = h
        // 需要初始化不同的数据画笔
        this.uiPencil = new UIPencil(w, h, this)

        if (Dep.target) {
            this.parent = Dep.target
            Dep.target.addPanel(this)
        }

        this.id = id++
    }

    render(): HTMLElement {
        const td = document.createElement('td')
        const wrapper = document.createElement('div')

        td.setAttribute('style', `width:${this.w}px;height:${this.h}px;padding:0`)
        wrapper.setAttribute('style', 'position:relative;width:100%;height:100%;overflow:hidden')
        wrapper.append(this.dataPencil.render(), this.uiPencil.render())
        td.append(wrapper)

        this.el = wrapper
        return td
    }

    dataReceiver(data: FixedUnit[]): any {
    }

    update(eventName: string, payload: any): any {
    }
}
