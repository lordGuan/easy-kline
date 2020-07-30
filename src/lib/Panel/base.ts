/**
 * 面板基类
 */
class BasePanel {
    el: HTMLElement

    constructor(w: number, h: number) {
        const wrapper = document.createElement('div')
        wrapper.setAttribute('style', 'position:relative;width:100%;height:100%')

        // 主面板，用于绘制K线
        const mainCanvas = document.createElement('canvas')
        mainCanvas.setAttribute('width', '' + w)
        mainCanvas.setAttribute('height', '' + h)
        mainCanvas.setAttribute('id', 'bg')
        mainCanvas.setAttribute('style', 'position:absolute;top:0;left:0')

        // 辅面板，用于绘制与鼠标动作相关的
        const uiCanvas = document.createElement('canvas')
        uiCanvas.setAttribute('width', '' + w)
        uiCanvas.setAttribute('height', '' + h)
        uiCanvas.setAttribute('id', 'ui')
        uiCanvas.setAttribute('style', 'position:absolute;top:0;left:0;cursor:none')

        wrapper.append(mainCanvas, uiCanvas)

        this.el = wrapper
    }
}
