import { BasePencil } from './base'
import { TimePanel } from '../Panel'

export class TimePencil extends BasePencil<TimePanel> {
    parent: TimePanel

    /**
     * 绘制时间轴
     */
    draw() {
        const { w } = this

        // 先来画一根横轴
        this.ctx.beginPath()
        this.ctx.moveTo(0, 0)
        this.ctx.lineTo(w, 0)
        this.ctx.stroke()
        this.ctx.closePath()

        this.ctx.textAlign = 'center'

        this.parent.timeline.forEach((unit, index) => {
            if (index % 8 === 0 && index !== 0) {
                // 再来画一根小竖线
                this.ctx.beginPath()
                this.ctx.moveTo(unit.x, 0)
                this.ctx.lineTo(unit.x, 5)
                this.ctx.stroke()
                this.ctx.closePath()

                const y = 15
                // 每五个点画一次
                this.ctx.fillText(new Date(unit.time).toLocaleString(), unit.x, y)
            }
        })
    }
}
