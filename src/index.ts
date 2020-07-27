import data from '../data.json'

const body = document.getElementById('main')
const canvas = document.createElement('canvas')
canvas.setAttribute('width', '1300px')
canvas.setAttribute('height', '300px')
canvas.setAttribute('id', 'bg')

const uiCanvas = document.createElement('canvas')
uiCanvas.setAttribute('width', '1300px')
uiCanvas.setAttribute('height', '300px')
uiCanvas.setAttribute('id', 'ui')

const ctx = canvas.getContext('2d')
const uiCtx = uiCanvas.getContext('2d')

body.append(canvas)
body.append(uiCanvas)

// 根据数据确定坐标系纵轴范围
let range = [0, Infinity]
data.forEach((k) => {
    let max = Math.max(k.high, k.open, k.low, k.close)
    let min = Math.min(k.high, k.open, k.low, k.close)
    if (max > range[0]) {
        range[0] = max
    }

    if (min < range[1]) {
        range[1] = min
    }
})

// 纵向高度300px，将range映射到上面
let yPix = (range[0] - range[1]) / 300

// 绘图
data.forEach((k, index) => {
    if (k.open >= k.close) {
        // 开盘价>收盘价 下跌
        drawCandle(1, k, index)
    } else {
        drawCandle(2, k, index)
    }
})

let mouseRecord = []
let isIn = false

uiCanvas.addEventListener('mouseenter', (_) => {
    isIn = true
})

// !!! 用多个canvas叠加
uiCanvas.addEventListener('mousemove', (e) => {
    mouseRecord.push({ x: e.offsetX, y: e.offsetY })
    // drawMouse(e.offsetX, e.offsetY)
})

uiCanvas.addEventListener('mouseleave', (_) => {
    isIn = false
})

function drawCandle(type, data, index) {
    let top = type === 1 ? data.open : data.close
    ctx.fillStyle = type === 1 ? 'red' : 'green'
    ctx.fillRect(
        index * 10,
        (range[0] - top) / yPix,
        10,
        Math.abs(data.open - data.close) / yPix || 1
    )

    ctx.beginPath()
    ctx.moveTo(index * 10 + 5, (range[0] - data.high) / yPix)
    ctx.lineTo(index * 10 + 5, (range[0] - data.low) / yPix)
    ctx.strokeStyle = type === 1 ? 'red' : 'green'
    ctx.stroke()
    ctx.closePath()
}

function drawMouse(x, y) {
    uiCtx.clearRect(0, 0, 1300, 300)

    let xA = new Path2D()
    xA.moveTo(x, 0)
    xA.lineTo(x, 300)

    let yA = new Path2D()
    yA.moveTo(0, y)
    yA.lineTo(1300, y)

    uiCtx.stroke(xA)
    uiCtx.stroke(yA)
}

// 舍弃原则，不然动画跟不上
function drawMouseRecord() {
    if (isIn) {
        if (mouseRecord.length > 0) {
            let point = mouseRecord.splice(0, 1)[0]
            drawMouse(point.x, point.y)
        }
    } else {
        uiCtx.clearRect(0, 0, 1300, 300)
    }
    requestAnimationFrame(drawMouseRecord)
}

drawMouseRecord()

// @ts-ignore
window.mouseRocrd = mouseRecord
