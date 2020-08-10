import { FixedUnit } from 'easy-kline'
import { BasePanel } from './base'
import { AxisPencil } from '../Pencil/axis'
import { floor } from 'lodash'

/**
 * 轴面板
 */
export class AxisPanel extends BasePanel {
    range: [number, number]
    totalRange: [number, number]
    dataPencil: AxisPencil

    constructor(w: number, h: number) {
        super(w, h)

        this.dataPencil = new AxisPencil(w, h, this)
        this.range = [Infinity, 0]
    }

    update(eventName: string, payload: any): any {
        const { y } = payload
        const price = this.yToP(y)
        const { offsetTop } = this.el
        const { h } = this


        if (y > offsetTop && y < offsetTop + h) {
            this.uiPencil.drawPrice(y - offsetTop, price + '')
        } else {
            this.uiPencil.clear()
        }
    }

    dataReceiver(data: FixedUnit[]): any {
        // 接到数据，保留价格部分
        // 扩张率5%，上下各扩张5%
        const expendRate = 0.05

        // 取价格区间
        data.forEach(unit => {
            const { open, close, high, low } = unit
            let max = Math.max(open, close, high, low)
            let min = Math.min(open, close, high, low)
            if (max > this.range[1]) {
                this.range[1] = max
            }
            if (min < this.range[0]) {
                this.range[0] = min
            }
        })

        // 扩张区间
        let rangeDiff = this.range[1] - this.range[0],
            expend = (expendRate / (1 - 2 * expendRate)) * rangeDiff

        this.totalRange = [this.range[0] - expend, this.range[1] + expend]

        this.dataPencil.draw()
    }

    /**
     * 鼠标位置 to 具体价格
     * top - {[y*(top-bottom)]/h}
     * @param y
     */
    yToP(y: number) {
        const { h, parent } = this
        const [bottom, top] = this.totalRange
        const pricePlace = parent.symbolConfig.pricePlace

        return floor(top - (y * (top - bottom) / h), pricePlace)
    }

    /**
     * 具体价格 to y轴位置
     * @param p
     */
    pToY(p: number) {
        const { h } = this
        const [top, bottom] = this.totalRange

        return h * ((top - p) / (top - bottom))
    }
}
