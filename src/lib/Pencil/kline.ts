import { BasePencil } from './base'
import { MainPanel } from '../Panel'
import { FixedUnit } from 'easy-kline'

/**
 * 画蜡烛图的画笔
 */
export class KindlePencil extends BasePencil<MainPanel> {

    draw(data: FixedUnit[]) {
        const axis = this.parent.axis
        const { unitW } = this.parent.parent.timePanel
        const { range } = this.parent

        data.forEach((unit, index) => {
            const color = unit.type === 1 ? 'green' : 'red'

            const yOfOpen = axis.pToY(unit.open)
            const yOfClose = axis.pToY(unit.close)

            // 画柱子
            this.ctx.fillStyle = color
            this.ctx.fillRect(
                index * unitW,
                unit.type === 1 ? yOfOpen : yOfClose,
                unitW,
                Math.abs(yOfOpen - yOfClose) || 1
            )

            const middleX = index * unitW + Math.floor(0.5 * unitW)

            // 画上下影线
            this.ctx.beginPath()
            this.ctx.moveTo(middleX, axis.pToY(unit.high))
            this.ctx.lineTo(middleX, axis.pToY(unit.low))
            this.ctx.strokeStyle = color
            this.ctx.stroke()
            this.ctx.closePath()

            if (unit.high >= range[1]) {
                // 画最大值
                this.ctx.fillStyle = '#000000'
                this.ctx.textBaseline = 'bottom'
                this.ctx.textAlign = 'center'
                this.ctx.fillText(unit.high + '', middleX, axis.pToY(unit.high))
            }

            if (unit.low <= range[0]) {
                // 画最小值
                this.ctx.fillStyle = '#000000'
                this.ctx.textBaseline = 'top'
                this.ctx.textAlign = 'center'
                this.ctx.fillText(unit.low + '', middleX, axis.pToY(unit.low))
            }
        })
    }
}
