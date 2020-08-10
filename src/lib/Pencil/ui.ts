import { BasePencil } from './base'
import { BasePanel } from '../Panel/base'

export class UIPencil extends BasePencil<BasePanel> {
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
        const { w, h } = this


        this.clear()
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
        ctx.setLineDash([3, 3])
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
        ctx.setLineDash([3, 3])
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.closePath()
        ctx.stroke()
    }

    drawTime(x: number, time: string) {
        const { ctx, h, w } = this
        this.clear()

        // 画一个彩色框框
        const textWidth = ctx.measureText(time).width + 10
        const halfTextWidth = Math.floor(0.5 * textWidth)
        let fixedX = x - halfTextWidth
        let rectX = fixedX
        let textX = x

        // 左边界
        if (fixedX < 0) {
            rectX = 0
            textX = x - fixedX
        }

        // 右边界
        if (x + halfTextWidth > w) {
            rectX = w - textWidth
            textX = w - halfTextWidth
        }

        ctx.fillStyle = 'rgba(88,88,88,.7)'
        ctx.fillRect(rectX, 0, textWidth, h)

        // 再画文字
        ctx.fillStyle = '#FFFFFF'
        ctx.textAlign = 'center'
        ctx.fillText(time, textX, 15)
    }

    /**
     * 在指定位置绘制价格
     * @param y
     * @param price
     */
    drawPrice(y: number, price: string) {
        const { ctx, w } = this
        this.clear()

        // 画一个彩色框框
        ctx.fillStyle = 'rgba(88,88,88,.7)'
        ctx.fillRect(0, y - 10, w, 20)

        // 再画文字
        ctx.fillStyle = '#ffffff'
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.fillText(price, Math.floor(0.5 * w), y)
    }

    clear() {
        const { ctx, w, h } = this
        ctx.clearRect(0, 0, w, h)
    }
}
