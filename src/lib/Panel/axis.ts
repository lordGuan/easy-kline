import { BasePencil } from '../Pencil'
import { Unit } from 'easy-kline'
import { BasePanel } from './base'

/**
 * 轴面板
 */
export class AxisPanel extends BasePanel {
    constructor(w: number, h: number) {
        super(w, h)

        this.dataPencil = new BasePencil(w, h, this)
    }

    update(eventName: string, payload: any): any {
        this.uiPencil.drawUI(payload.x, payload.y)
    }

    dataReceiver(data: Unit[]): any {
    }
}
