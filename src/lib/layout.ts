import Panel from './Panel'

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
 * 在容器内绘制基本布局
 * @param container
 */
export function create(container: HTMLElement) {
    // 容器尺寸
    const containerW = container.clientWidth,
        containerH = container.clientHeight

    // 主区域宽度。占比97%
    const mainW = Math.floor(containerW * 0.97)
    // y轴宽度。占比3%
    const yAxisW = containerW - mainW
    // x轴高度。固定20px
    const xAxisH = 20
    // 主区域高度。占比74
    const mainH = Math.floor(containerH * 0.74)
    // 副区域高度。
    const minorH = containerH - xAxisH - mainH

    const panels = []

    function createRow(h: number): HTMLElement {
        const row = document.createElement('tr')
        setNoneSelect(row)

        // 初始化DataPanel
        const bodyCell = document.createElement('td')
        setSize(bodyCell, mainW, h, true)
        const dataPanel = new Panel(bodyCell, mainW, h)

        // 初始化AxisPanel
        const axisCell = document.createElement('td')
        setSize(axisCell, yAxisW, h, true)
        const axisPanel = new Panel(axisCell, yAxisW, h)

        row.append(bodyCell, axisCell)
        panels.push(dataPanel)
        panels.push(axisPanel)
        return row
    }

    // 主表格
    const table = document.createElement('table')
    table.setAttribute('cellpading', '0')
    table.setAttribute('cellspacing', '0')
    setSize(table, containerW, containerH)

    // 主表体
    const body = document.createElement('tbody')
    setNoneSelect(body)

    // 第一行：主区域+价格y轴
    const firstRow = createRow(mainH)
    // 第二行：主区域+成交量y轴
    const secondRow = createRow(minorH)
    // 第三行：x轴+占位
    const thirdRow = createRow(xAxisH)
    body.append(firstRow, secondRow, thirdRow)
    table.append(body)
    container.append(table)

    return panels
}
