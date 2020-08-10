import { FixedUnit } from 'easy-kline'
import { BaseMainPanel } from './base'
import { KindlePencil } from '../Pencil'
import { AxisPanel } from './axis'
import { Dep } from '../../utils/dep'

/**
 * 基础面板
 */
export class MainPanel extends BaseMainPanel {
    dataPencil: KindlePencil
    axis: AxisPanel

    constructor(w: number, h: number) {
        super(w, h)

        if (Dep.target) {
            Dep.target.addPanel(this)
        }

        // 初始化蜡烛图画笔
        this.dataPencil = new KindlePencil(w, h, this)
    }


    /**
     * 接收数据
     * @param data
     */
    dataReceiver(data: FixedUnit[]) {

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

        // 先广播给轴，在进行画图，保证轴信息完备
        // this.axis.dataReceiver(data)
        this.axis.rangeUpdate(this.range)

        // 基础面板拿到数据后，绘制K线图
        this.dataPencil.draw(data)
    }
}
