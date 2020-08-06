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

    interface RowContainer<T extends Panel, U extends Panel> {

    }

    interface EasyKline {
        el: HTMLElement
        config: EasyKlineConfig
        symbolConfig: SymbolConfig
        adapter: EasyDataAdapter
        mainPanel: Panel
        timePanel: Panel
        rows: RowContainer<Panel, Panel>[]
        panels: Panel[]
        // 缩放量：由滚动事件计算修改
        scale: number
        // 位移量：由拖拽事件计算修改
        movement: number
        // 原始数据：有adapter得到，全量数据
        data: FixedUnit[]
        readyCallbacks: Set<Function>
    }

    interface Sizeable {
        el: HTMLElement
        w: number
        h: number

        render(): HTMLElement
    }

    interface Pencil extends Sizeable {
        canvas: HTMLCanvasElement
        ctx: CanvasRenderingContext2D

        draw(data: FixedUnit[]): void

        drawUI(x: number, y: number): void
    }

    interface Panel extends Sizeable {
        id: number
        parent: EasyKline

        update(eventName: string, payload: any): any

        dataReceiver(data: FixedUnit[]): any
    }

    interface PanelConstructor<T> {
        new(w: number, h: number): T
    }
}
