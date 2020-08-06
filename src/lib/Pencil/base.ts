import { FixedUnit, Panel, Pencil } from 'easy-kline'

export class BasePencil implements Pencil{
    el: HTMLElement
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    w: number
    h: number
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

        this.el = mainCanvas
        return mainCanvas
    }

    draw(data: FixedUnit[]) {
    }

    drawUI(x: number, y: number): void {
    }
}
