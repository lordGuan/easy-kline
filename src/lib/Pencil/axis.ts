import { BasePencil } from './base'
import { AxisPanel } from '../Panel'

export class AxisPencil extends BasePencil<AxisPanel> {
    draw() {
        this.parent.parent.symbolConfig.pricePlace
        const { ctx, h } = this

        // 先画一条竖线
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, h)
        ctx.stroke()
        ctx.closePath()

        // 然后画价格

    }

}

export class PriceAxisPencil extends AxisPencil {

}

export class VolumeAxisPencil extends AxisPencil {

}
