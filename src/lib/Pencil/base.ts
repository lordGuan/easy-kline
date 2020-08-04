import { FixedUnit, Pencil } from 'easy-kline'
import { Panel } from '../Panel'

export class DataPencil implements Pencil {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    w: number
    h: number
    range: [number, number]
    parent: Panel

    constructor(w: number, h: number, parent: Panel) {
        this.w = w
        this.h = h
        this.parent = parent
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
    draw(data?: FixedUnit[], range?: [number, number]) {
        this.range = range
        data.forEach((unit, index) => {
            this.drawUnit(unit, index)
        })
    }

    drawUnit(unit: FixedUnit, index: number) {

    }
}
