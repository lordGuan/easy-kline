// import { FixedUnit } from 'easy-kline'
import { BasePencil } from './base'
import { MainPanel } from '../Panel'

/**
 * 画蜡烛图的画笔
 */
export class KindlePencil extends BasePencil<MainPanel> {

    // drawUnit(unit: FixedUnit, index: number) {
    // const ctx = this.ctx
    // const [ceil, floor] = this.range
    // const { realUnitW, h } = this.parent.getAxisInfo()
    // const color = unit.type === 1 ? 'red' : 'green'
    // // y轴的对应情况
    // const yPix = (ceil - floor) / h
    // const top = unit.type === 1 ? unit.open : unit.close
    // const middleX = index * realUnitW + Math.floor(0.5 * realUnitW)
    //
    // // 画柱子
    // ctx.fillStyle = color
    // ctx.fillRect(
    //     index * realUnitW,
    //     (ceil - top) / yPix,
    //     realUnitW,
    //     Math.abs(unit.open - unit.close) / yPix || 1
    // )
    //
    // // 画上下影线
    // ctx.beginPath()
    // ctx.moveTo(middleX, (ceil - unit.high) / yPix)
    // ctx.lineTo(middleX, (ceil - unit.low) / yPix)
    // ctx.strokeStyle = color
    // ctx.stroke()
    // ctx.closePath()
    // }
}
