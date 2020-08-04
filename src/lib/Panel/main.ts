import { FixedUnit } from 'easy-kline'
import { BasePanel, Panel } from './base'
import { KindlePencil } from '../Pencil'
import { EasyKline } from '../../index'

/**
 * 基础面板
 */
export class MainPanel extends BasePanel implements Panel {

    constructor(containerW: number, h: number, parent: EasyKline) {
        super(containerW, h, parent)

        // 初始化蜡烛图画笔
        this.dataPencil = new KindlePencil(this.w, h, this)
    }

    update(eventName: string, payload: any): any {
        // console.log('MainPanel receive event:', eventName, payload)
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

    /**
     * 获取坐标轴信息
     */
    getAxisInfo(x, y): [number, number] {
        return this.parent.timePanel.getAxisInfo(x, y)
    }
}
