import { FixedUnit, Unit } from 'easy-kline'

interface Sizeable {
    w: number
    h: number

    render(): HTMLElement
}

export interface Panel extends Sizeable {
    el: HTMLElement
    dataPencil: DataPencil
    uiPencil: UIPencil

    update(eventName: string, payload: any): any

    dataReceiver(data: FixedUnit[], range: [number, number]): any
}

interface Pencil extends Sizeable {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    range: [number, number]
}

class BasePanel {
    el: HTMLElement
    h: number
    w: number
    _w: number
    dataPencil: DataPencil
    uiPencil: UIPencil
    axisPanel: AxisPanel
    range: [number, number]

    constructor(containerW: number, h: number) {
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

        this.axisPanel = new AxisPanel(yAxisW, h)

        this.range = [0, Infinity]
    }

    render(): HTMLElement {
        const tr = document.createElement('tr')
        const td = document.createElement('td')
        const wrapper = document.createElement('div')

        wrapper.setAttribute('style', 'position:relative;width:100%;height:100%')
        wrapper.append(this.dataPencil.render(), this.uiPencil.render())
        td.append(wrapper)
        tr.append(td, this.axisPanel.render())
        return tr
    }
}

/**
 * 基础面板
 */
export class MainPanel extends BasePanel implements Panel {

    constructor(containerW: number, h: number) {
        super(containerW, h)

        // 初始化蜡烛图画笔
        this.dataPencil = new KindlePencil(this.w, h)
    }

    update(eventName: string, payload: any): any {
        // console.log('MainPanel receive event:', eventName, payload)
    }

    /**
     * 接收数据
     * @param data
     * @param range 数据范围
     */
    dataReceiver(data: FixedUnit[], range: [number, number]) {
        // 基础面板拿到数据后，绘制K线图

        // this.dataPencil.draw()
    }

}

/**
 * 时间轴面板
 */
export class TimePanel extends BasePanel {
    constructor(containerW: number, h: number) {
        super(containerW, h)
    }

    update(eventName: string, payload: any): any {
        // console.log('TimePanel receive event:', eventName, payload)
    }
}

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

        this.dataPencil = new DataPencil(w, h)
        this.uiPencil = new UIPencil(w, h)
    }

    render(): HTMLElement {
        const td = document.createElement('td')
        const wrapper = document.createElement('div')

        wrapper.setAttribute('style', 'position:relative;width:100%;height:100%')
        wrapper.append(this.dataPencil.render(), this.uiPencil.render())
        td.append(wrapper)
        return td
    }

    update(eventName: string, payload: any): any {
    }

    dataReceiver(data: Unit[]): any {
    }
}

class DataPencil implements Pencil {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    w: number
    h: number
    range: [number, number]

    constructor(w: number, h: number) {
        this.w = w
        this.h = h
    }

    render(): HTMLCanvasElement {
        const { w, h } = this
        const mainCanvas = document.createElement('canvas')
        mainCanvas.setAttribute('width', '' + w)
        mainCanvas.setAttribute('height', '' + h)
        mainCanvas.setAttribute('id', 'bg')
        mainCanvas.setAttribute('style', 'position:absolute;top:0;left:0')

        this.canvas = mainCanvas
        this.ctx = mainCanvas.getContext('2d')

        return mainCanvas
    }

    /**
     * 主要画K线图
     * @param data
     * @param range
     */
    draw(data: FixedUnit[], range: [number, number]) {
        this.range = range
        data.forEach((unit, index) => {
            this.drawUnit(unit, index)
        })
    }

    drawUnit(unit: FixedUnit, index: number) {
        // const ctx = this.ctx
        // const [ceil, floor] = this.range
        // const { realUnitW, h } = this.panel.setting
        // const color = unit.type === 1 ? 'red' : 'green'
        // // y轴的对应情况
        // const yPix = (ceil - floor) / h
        // const top = unit.type === 1 ? unit.open : unit.close
        // const middleX = index * realUnitW + Math.floor(0.5 * realUnitW)
        //
        // // 画柱子
        // ctx.fillStyle = color
        // ctx.fillRect(
        //     index * realUnitW,
        //     (ceil - top) / yPix,
        //     realUnitW,
        //     Math.abs(unit.open - unit.close) / yPix || 1
        // )
        //
        // // 画上下影线
        // ctx.beginPath()
        // ctx.moveTo(middleX, (ceil - unit.high) / yPix)
        // ctx.lineTo(middleX, (ceil - unit.low) / yPix)
        // ctx.strokeStyle = color
        // ctx.stroke()
        // ctx.closePath()
    }

}

/**
 * 画蜡烛图的画笔
 */
class KindlePencil extends DataPencil {
    draw(data: FixedUnit[]) {

    }
}

class UIPencil implements Pencil {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    h: number
    w: number
    range: [number, number]

    constructor(w: number, h: number) {
        this.w = w
        this.h = h
    }

    render(): HTMLCanvasElement {
        const { w, h } = this
        const uiCanvas = document.createElement('canvas')
        uiCanvas.setAttribute('width', '' + w)
        uiCanvas.setAttribute('height', '' + h)
        uiCanvas.setAttribute('id', 'ui')
        uiCanvas.setAttribute('style', 'position:absolute;top:0;left:0;cursor:none')
        return uiCanvas
    }
}
