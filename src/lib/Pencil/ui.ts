import { Pencil } from 'easy-kline'
import { Panel } from '../Panel'

export class UIPencil implements Pencil {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    h: number
    w: number
    range: [number, number]
    parent: Panel

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

    setPanel(parent: Panel) {
        this.parent = parent
    }
}
