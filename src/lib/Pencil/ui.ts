import { Panel } from 'easy-kline'
import { BasePencil } from './base'

export class UIPencil extends BasePencil {
    constructor(w: number, h: number, parent: Panel) {
        super(w, h, parent)
    }

    render(): HTMLCanvasElement {
        const { w, h } = this
        const uiCanvas = document.createElement('canvas')
        uiCanvas.setAttribute('width', '' + w)
        uiCanvas.setAttribute('height', '' + h)
        uiCanvas.setAttribute('id', 'ui')
        uiCanvas.setAttribute('style', 'position:absolute;top:0;left:0;')

        this.canvas = uiCanvas
        this.ctx = uiCanvas.getContext('2d')
        return uiCanvas
    }

    /**
     * 根据当前鼠标位置绘制UI
     * @param x
     * @param y
     */
    drawUI(x: number, y: number) {
        const { offsetLeft, offsetTop } = this.parent.el
        const { ctx, w, h } = this


        ctx.clearRect(0, 0, w, h)
        if (x > offsetLeft && x < offsetLeft + w) {
            this.drawX(x)
        }

        if (y > offsetTop && y < offsetTop + h) {
            this.drawY(y - offsetTop)
        }
    }

    /**
     * 画水平线
     */
    drawY(y: number) {
        const { ctx, w } = this
        ctx.beginPath()
        ctx.setLineDash([5, 2])
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.closePath()
        ctx.stroke()
    }

    /**
     * 画垂直线
     */
    drawX(x: number) {
        const { ctx, h } = this
        ctx.beginPath()
        ctx.setLineDash([5, 2])
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.closePath()
        ctx.stroke()
    }
}
