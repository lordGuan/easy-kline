import { FixedUnit } from 'easy-kline'
import { BasePanel } from '../Panel/base'

export class BasePencil<T extends BasePanel> {
    el: HTMLElement
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    w: number
    h: number
    parent: T

    constructor(w: number, h: number, parent: T) {
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

        this.el = mainCanvas
        return mainCanvas
    }

    draw(data: FixedUnit[]) {
    }

    drawUI(x: number, y: number): void {
    }

    clear() {

    }

    drawPrice(y: number, price: string): void {
    }

    drawTime(x: number, time: string): void {
    }
}
