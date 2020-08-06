import { FixedUnit } from 'easy-kline'
import { BasePanel } from './base'
import { DEFAULT_SIZING } from '../../constants'
import { TimePencil } from '../Pencil'

/**
 * 时间轴面板
 */
export class TimePanel extends BasePanel {
    // 缩放量：由滚动事件计算修改
    scale: number
    // 位移量：由拖拽事件计算修改
    movement: number
    // 轴上左右端点
    start: number
    end: number
    unitW: number
    // 时间轴
    timeline: {
        x: number,
        time: number
    }[]

    constructor(containerW: number, h: number) {
        super(containerW, h)

        this.scale = 1
        this.movement = 0
        this.unitW = this.scale * DEFAULT_SIZING.UNIT_W_OF_X
        this.timeline = []

        const { w } = this
        const { interval } = this.parent.config
        const fixedInterval = interval * 1000

        this.dataPencil = new TimePencil(w, h, this)

        // 主窗口最大容纳单位数
        // 理论上时间轴上就有这么多数字
        const MAX_UNIT_COUNT = Math.floor(w / this.unitW)

        const now = Date.now()
        // 根据interval决定拉取数据的范围
        // 当前时刻对应的周期点
        const end = now - (now % fixedInterval)

        // this.timeline.push()
        for (let i = MAX_UNIT_COUNT - 1; i >= 0; i--) {
            this.timeline.push({
                time: end - Math.floor((MAX_UNIT_COUNT - i - 1) * (1 + DEFAULT_SIZING.EXTEND_PERCENT)) * fixedInterval,
                x: Math.floor((i + 1 / 2) * this.unitW)
            })
        }

        this.timeline.reverse()
    }

    update(eventName: string, payload: any): any {
        this.uiPencil.drawUI(payload.x, payload.y)
    }

    /**
     * 接收数据
     * @param data
     */
    dataReceiver(data: FixedUnit[]) {
        // 基础面板拿到数据后，绘制K线图

        this.dataPencil.draw(data)
    }

    /**
     * 获取一个用于
     */
    getAxisInfo(x: number, _: number): [number, number] {
        // 求出第i根
        const i = (x - this.start) / this.parent.config.interval

        // 求第i根在canvas上的定位
        return [Math.floor((i - 1 / 2) * this.unitW), 0]
        // return (time) => {
        //     // 求出第i根
        //     const i = (time - this.start) / this.parent.config.interval
        //
        //     // 求第i根在canvas上的定位
        //     return (i - 1 / 2) * this.unitW
        // }
    }
}
