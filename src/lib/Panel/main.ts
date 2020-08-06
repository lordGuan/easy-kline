import { FixedUnit } from 'easy-kline'
import { BasePanel } from './base'
import { KindlePencil } from '../Pencil'

/**
 * 基础面板
 */
export class MainPanel extends BasePanel {
    constructor(w: number, h: number) {
        super(w, h)

        // 初始化蜡烛图画笔
        this.dataPencil = new KindlePencil(w, h, this)

    }

    update(eventName: string, payload: any): any {
        // 判断鼠标位置，决定是画十字线和竖线
        this.uiPencil.drawUI(payload.x, payload.y)
    }

    /**
     * 接收数据
     * @param data
     */
    dataReceiver(data: FixedUnit[]) {
        // 坐标轴信息讲道理应该有数据确定

        // 基础面板拿到数据后，绘制K线图

        // this.dataPencil.draw()
    }
}
