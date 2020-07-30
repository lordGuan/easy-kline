import { FixedUnit, PanelSetting, Unit } from 'easy-kline'
import { DataLayer, UILayer } from './Layer'
import { debounce } from 'lodash'

class Panel {
    el: HTMLElement
    setting: PanelSetting
    protected canvas: HTMLCanvasElement
    protected dataLayer: DataLayer
    protected uiLayer: UILayer
    protected dataSet: FixedUnit[]

    constructor(el: HTMLElement, containerW: number, containerH: number) {
        const wrapper = document.createElement('div')
        wrapper.setAttribute('style', 'position:relative;width:100%;height:100%')

        // 主面板，用于绘制K线
        const mainCanvas = document.createElement('canvas')
        mainCanvas.setAttribute('width', '' + containerW)
        mainCanvas.setAttribute('height', '' + containerH)
        mainCanvas.setAttribute('id', 'bg')
        mainCanvas.setAttribute('style', 'position:absolute;top:0;left:0')

        // 辅面板，用于绘制与鼠标动作相关的
        const uiCanvas = document.createElement('canvas')
        uiCanvas.setAttribute('width', '' + containerW)
        uiCanvas.setAttribute('height', '' + containerH)
        uiCanvas.setAttribute('id', 'ui')
        uiCanvas.setAttribute('style', 'position:absolute;top:0;left:0;cursor:none')

        this.dataLayer = new DataLayer(mainCanvas.getContext('2d'), this)
        this.uiLayer = new UILayer(uiCanvas.getContext('2d'), this)

        wrapper.append(mainCanvas, uiCanvas)
        el.append(wrapper)

        this.el = el

        this.setting = {
            w: containerW,
            h: containerH,
            realUnitW: 10
        }

        this.bindEvent()
    }

    bindEvent() {
        const { realUnitW } = this.setting
        this.el.addEventListener(
            'mousemove',
            debounce((e) => {
                // 矫正横坐标只能落在柱子中央的位置
                // 实际柱宽度
                // 柱中轴
                const middle_of_bar = 0.5 * realUnitW
                let fixed_x = e.offsetX
                // 包含了多少根柱
                let bar_count_in = Math.floor(fixed_x / realUnitW)
                // 超过量 要么在中轴左边，要么在中轴右边
                let mouse_offset = fixed_x % realUnitW
                // 判断超过量与中轴
                fixed_x = bar_count_in * realUnitW - middle_of_bar
                if (mouse_offset > 0) {
                    fixed_x += 2 * middle_of_bar
                }
                this.uiLayer.draw(fixed_x, e.offsetY)
            })
        )

        this.el.addEventListener('mouseleave', (_) => {
            this.uiLayer.clear()
        })
    }

    /**
     * 初始化数据集
     * @param data
     */
    initDataSet(data: Unit[]) {
        this.dataSet = data.map<FixedUnit>((unit) => ({
            ...unit,
            type: unit.open > unit.close ? 1 : 2
        }))
    }

    draw() {
        return new Promise((resolve) => {
            this.dataLayer.draw(this.dataSet.slice(0, 100))
            resolve()
        })
    }

    /**
     * 接收
     */
    receiveEvent() {}

    receiveData(data) {}
}

export default Panel
