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
        const { offsetTop } = this.el
        const price = this.yToP(y - offsetTop)
        const { h } = this


        if (y > offsetTop && y < offsetTop + h) {
            this.uiPencil.drawPrice(y - offsetTop, price + '')
        } else {
            this.uiPencil.clear()
        }
    }

    rangeUpdate(range: [number, number]) {
        // 接到数据，保留价格部分
        // 扩张率5%，上下各扩张5%
        const expendRate = 0.05

        // 扩张区间
        let rangeDiff = range[1] - range[0],
            expend = (expendRate / (1 - 2 * expendRate)) * rangeDiff

        this.totalRange = [range[0] - expend, range[1] + expend]

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
        const [bottom, top] = this.totalRange

        return h * ((top - p) / (top - bottom))
    }
}
