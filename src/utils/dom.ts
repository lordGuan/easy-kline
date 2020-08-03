/// DOM相关操作

import Panel from '../lib/Panel'

/**
 * 设置元素不可选择
 * @param el
 */
function setNoneSelect(el: HTMLElement) {
    let oldStyle = el.getAttribute('style') || ''
    el.setAttribute('style', 'user-select: none;' + oldStyle)
}

/**
 * 设置元素宽高
 * @param el
 * @param w
 * @param h
 * @param cell 是否用于规定单元格尺寸
 */
function setSize(el: HTMLElement, w: number, h: number, cell = false) {
    let baseStyle = `width:${w}px;height:${h}px;user-select:none;`
    if (cell) {
        baseStyle += 'padding:0;margin:0;border:none;overflow:hidden;'
    }
    el.setAttribute('style', baseStyle)
}

/**
 * 构造基础布局表格
 * @param w
 * @param h
 */
export function createTable(w: number, h: number): HTMLElement {
    // 主表格
    const table = document.createElement('table')
    table.setAttribute('cellpading', '0')
    table.setAttribute('cellspacing', '0')
    setSize(table, w, h)

    // 主表体
    const body = document.createElement('tbody')
    setNoneSelect(body)

    return table
}

export function createRow(
    w0: number,
    w1: number,
    h: number,
    slot1: HTMLElement,
    slot2?: HTMLElement
): HTMLElement {
    const row = document.createElement('tr')
    setNoneSelect(row)

    // 初始化DataPanel
    const bodyCell = document.createElement('td')
    setSize(bodyCell, w0, h, true)
    bodyCell.append(slot1)

    // 初始化AxisPanel
    const axisCell = document.createElement('td')
    setSize(axisCell, w1, h, true)
    if (slot2) {
        axisCell.append(slot2)
    }

    row.append(bodyCell, axisCell)
    return row
}

const TAG_CREATOR_MAP = {
    'tr': createRow
}

export function createElement(tag: string, w?: number, h?: number) {
    TAG_CREATOR_MAP[tag](w, h)
}
