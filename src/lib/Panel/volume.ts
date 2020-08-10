import { BaseMainPanel } from './base'
import { VolumePencil } from '../Pencil/volume'
import { AxisPanel } from './axis'
import { Dep } from '../../utils/dep'
import { FixedUnit } from 'easy-kline'

export class VolumePanel extends BaseMainPanel {
    dataPencil: VolumePencil
    axis: AxisPanel

    constructor(w: number, h: number) {
        super(w, h)

        if (Dep.target) {
            Dep.target.addPanel(this)
        }

        // 初始化蜡烛图画笔
        this.dataPencil = new VolumePencil(w, h, this)
    }

    /**
     * 接收数据
     * @param data
     */
    dataReceiver(data: FixedUnit[]) {
        // 数量区间
        data.forEach(unit => {
            const { volume } = unit

            if (volume > this.range[1]) {
                this.range[1] = volume
            }
        })

        this.range[0] = 0

        // 先广播给轴，在进行画图，保证轴信息完备
        this.axis.rangeUpdate(this.range)

        // 基础面板拿到数据后，绘制数量柱形图
        this.dataPencil.draw(data)
    }
}
