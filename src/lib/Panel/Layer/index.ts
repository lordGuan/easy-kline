import { FixedUnit } from 'easy-kline'
import Panel from '../index'

class Layer {
    // 画笔肯定不能少
    protected ctx: CanvasRenderingContext2D
    // 图层所属的面板
    protected panel: Panel

    constructor(ctx: CanvasRenderingContext2D, panel: Panel) {
        this.ctx = ctx
        this.panel = panel
    }

    clear() {
        const { w, h } = this.panel.setting
        this.ctx.clearRect(0, 0, w, h)
    }
}

/**
 * 用于展示数据的图层
 */
export class DataLayer extends Layer {
    // 最大最小值，用于计算y轴的映射量
    private readonly range: [number, number]

    constructor(ctx: CanvasRenderingContext2D, panel: Panel) {
        super(ctx, panel)
        this.range = [0, Infinity]
    }

    /**
     * 主要画K线图
     * @param data
     */
    draw(data: FixedUnit[]) {
        data.forEach((k) => {
            let max = Math.max(k.high, k.open, k.low, k.close)
            let min = Math.min(k.high, k.open, k.low, k.close)
            if (max > this.range[0]) {
                this.range[0] = max
            }

            if (min < this.range[1]) {
                this.range[1] = min
            }
        })
        data.forEach((unit, index) => {
            this.drawUnit(unit, index)
        })
    }

    drawUnit(unit: FixedUnit, index: number) {
        const ctx = this.ctx
        const [ceil, floor] = this.range
        const { realUnitW, h } = this.panel.setting
        const color = unit.type === 1 ? 'red' : 'green'
        // y轴的对应情况
        const yPix = (ceil - floor) / h
        const top = unit.type === 1 ? unit.open : unit.close
        const middleX = index * realUnitW + Math.floor(0.5 * realUnitW)

        // 画柱子
        ctx.fillStyle = color
        ctx.fillRect(
            index * realUnitW,
            (ceil - top) / yPix,
            realUnitW,
            Math.abs(unit.open - unit.close) / yPix || 1
        )

        // 画上下影线
        ctx.beginPath()
        ctx.moveTo(middleX, (ceil - unit.high) / yPix)
        ctx.lineTo(middleX, (ceil - unit.low) / yPix)
        ctx.strokeStyle = color
        ctx.stroke()
        ctx.closePath()
    }
}

/**
 * 用于展示UI的图层
 * 鼠标对准线等，需要频繁擦除重绘的图层
 */
export class UILayer extends Layer {
    constructor(ctx: CanvasRenderingContext2D, panel: Panel) {
        super(ctx, panel)
    }

    /**
     * 绘制鼠标对准线
     * @param x
     * @param y
     */
    draw(x, y) {
        const { w, h } = this.panel.setting
        this.clear()

        let xA = new Path2D()
        xA.moveTo(x, 0)
        xA.lineTo(x, h)

        let yA = new Path2D()
        yA.moveTo(0, y)
        yA.lineTo(w, y)

        // 线段长度和间隔量
        this.ctx.setLineDash([5, 3])

        this.ctx.stroke(xA)
        this.ctx.stroke(yA)
    }
}
