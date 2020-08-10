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

        drawTime(x: number, time: string): void

        drawPrice(y: number, price: string): void

        clear(): void
    }


    interface PanelConstructor<T> {
        new(w: number, h: number): T
    }
}
