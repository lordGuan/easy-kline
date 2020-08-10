import { BasePencil } from './base'
import { VolumePanel } from '../Panel/volume'
import { FixedUnit } from 'easy-kline'

export class VolumePencil extends BasePencil<VolumePanel> {
    draw(data: FixedUnit[]) {
        const axis = this.parent.axis
        const { unitW } = this.parent.parent.timePanel
        const yOfZero = axis.pToY(0)

        data.forEach((unit, index) => {
            const color = unit.type === 1 ? 'green' : 'red'

            const yOfVolume = axis.pToY(unit.volume)
            // 画柱子
            this.ctx.fillStyle = color
            this.ctx.fillRect(
                index * unitW,
                yOfVolume,
                unitW,
                yOfZero - yOfVolume
            )
        })
    }
}
