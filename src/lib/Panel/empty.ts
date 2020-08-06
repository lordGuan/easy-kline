/**
 * 仅布局用，不具有绘图作用
 */
import { BasePanel } from './base'

export class EmptyPanel extends BasePanel {
    constructor(w: number, h: number) {
        super(w, h)
    }

    render(): HTMLElement {
        const td = document.createElement('td')
        const wrapper = document.createElement('div')

        wrapper.setAttribute('style', 'position:relative;width:100%;height:100%')
        td.append(wrapper)
        return td
    }
}
