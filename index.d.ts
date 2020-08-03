declare module 'easy-kline' {
    /**
     * 使用easy-kline需要提供的基础配置
     */
    interface EasyKlineConfig {
        el: HTMLElement
        adapter: EasyDataAdapter,
        symbol: string,
        interval: number
    }

    interface SymbolConfig {
        symbol: string,
        pricePlace: number, // 价格精度
    }

    /**
     * 数据转换装置
     */
    interface EasyDataAdapter {
        load(symbol: string, onLoad: (config: SymbolConfig) => any): any

        get(start: number, end: number, push: (data: Unit[]) => any): any

        sub(onNew: (unit: Unit | Unit[]) => any): number
    }

    interface ReadyCallback {
        (): any
    }

    /**
     * 原始基本单位：蜡烛图单个柱子
     */
    export interface Unit {
        open: number
        close: number
        high: number
        low: number
        volume: number
        time: number
    }

    /**
     * 计算修正单位
     */
    export interface FixedUnit extends Unit {
        type: 1 | 2 // 1-表示 open > close 2-表示 open <= close
    }

    export interface IDataPip {
    }

    interface PanelSetting {
        w: number
        h: number
        realUnitW: number
    }

    class Panel {
        protected canvas: HTMLCanvasElement
        protected dataLayer: DataLayer
        setting: PanelSetting

        new(el: HTMLElement)
    }

    class Layer {
        protected ctx: CanvasRenderingContext2D
        protected parent: Panel

        new(ctx: CanvasRenderingContext2D, parent: Panel)
    }

    class DataLayer extends Layer {
        draw(data: FixedUnit[])

        drawUnit(unit: FixedUnit, index: number)
    }
}
