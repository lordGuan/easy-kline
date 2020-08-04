import { DataPencil } from './base'
import { TimePanel } from '../Panel'

export class TimePencil extends DataPencil {
    parent: TimePanel

    /**
     * 绘制时间轴
     */
    draw() {
        const { h } = this
        this.parent.timeline.forEach((unit, index) => {
            if (index % 10 === 0) {
                const y = 0.5 * h
                // 每五个点画一次
                this.ctx.fillText(new Date(unit.time).toLocaleString(), unit.x, y)
            }
        })
    }
}
