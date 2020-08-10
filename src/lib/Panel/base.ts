import { FixedUnit, Pencil } from 'easy-kline'
import { UIPencil } from '../Pencil'
import { AxisPanel } from './axis'
import { EmptyPanel } from './empty'
import { EasyKline } from '../../index'
import { Dep } from '../../utils/dep'

let id = 0

export class BasePanel {
    el: HTMLElement
    h: number
    w: number
    dataPencil: Pencil
    uiPencil: UIPencil
    id: number
    parent: EasyKline
    axis: AxisPanel | EmptyPanel

    constructor(w: number, h: number) {
        this.w = w
        this.h = h
        // 需要初始化不同的数据画笔
        this.uiPencil = new UIPencil(w, h, this)

        if (Dep.target) {
            this.parent = Dep.target
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

    bindAxis(axisPanel: AxisPanel | EmptyPanel) {
        this.axis = axisPanel
    }
}

export class BaseMainPanel extends BasePanel {
    range: [number, number]

    constructor(w: number, h: number) {
        super(w, h)
        this.range = [Infinity, 0]
    }

    update(eventName: string, payload: any): any {
        // 判断鼠标位置，决定是画十字线和竖线
        if (eventName === 'mousemove') {
            const { offsetTop, offsetLeft } = this.el
            const { w, h } = this
            const { x, y } = payload

            this.uiPencil.clear()
            if (x > offsetLeft && x < offsetLeft + w) {
                this.uiPencil.drawX(x)
            }

            if (y > offsetTop && y < offsetTop + h) {
                this.uiPencil.drawY(y - offsetTop)
            }
        }

        if (eventName === 'mouseleave') {
            this.uiPencil.clear()
        }

        this.axis.update(eventName, payload)
    }
}
