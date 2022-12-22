<!-- eslint-disable no-const-assign -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { io } from 'socket.io-client'
import { computed } from '@vue/reactivity'

interface PositionInterface {
  x: number
  y: number
}

interface PositionArrayInterface extends Array<PositionInterface> {}

const colorPalette = ['black', 'white', 'blue', 'red', 'yellow', 'green']

const socket = io('http://localhost:5000')
let mousePressed = false
let lastPos: null | Array<number> = null
const drawColor = $ref('black')
const lineWidth = ref(15)
const lineWidthExamples = [0, 5, 10, 15, 20]

const canvas = $ref<HTMLElement>()
const ctx = ref<CanvasRenderingContext2D>()
onMounted(() => {
  ctx.value = canvas.getContext('2d')

  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    mousePressed = true
    draw(e)
  })

  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    if (mousePressed)
      draw(e)
  })

  canvas.addEventListener('mouseleave', (e: MouseEvent) => {
    lastPos = null
  })

  canvas.addEventListener('mouseup', (e: MouseEvent) => {
    mousePressed = false
    lastPos = null
  })

  socket.on('drawing', (color, width, startPos: PositionArrayInterface, endPos: PositionArrayInterface) => {
    ctx.value!.beginPath()
    ctx.value!.strokeStyle = color
    ctx.value!.lineWidth = width
    ctx.value!.lineJoin = 'round'
    ctx.value!.moveTo(...startPos)
    ctx.value!.lineTo(...endPos)
    ctx.value!.closePath()
    ctx.value!.stroke()
  })

  socket.on('clearCanvas', () => {
    ctx.value!.clearRect(0, 0, canvas.width, canvas.height)
  })

  // socket.on('socketNumber', (number) => {
  //   document.getElementById('counter').innerHTML = number
  // })
})

function setLineWidth(e: MouseEvent) {
  lineWidth.value = (e.target as HTMLElement).clientWidth - 5
}

const currentLineWidth = computed(() => {
  return (index: number) => {
    return lineWidth.value === lineWidthExamples[index - 1]
  }
})

function mousePos(e: MouseEvent) {
  const rect = canvas.getBoundingClientRect()
  return [
    (e.clientX - rect.left) * (canvas.width / rect.width),
    (e.clientY - rect.top) * (canvas.height / rect.height),
  ]
}

function draw(e: MouseEvent) {
  const [x, y] = mousePos(e)
  if (lastPos) {
    socket.emit('drawing', drawColor, lineWidth.value, lastPos, [x, y])

    lastPos = [x, y]
  }
  else {
    lastPos = [x, y]
  }
}

function clearCanvas() {
  socket.emit('clearCanvas')
}

onUnmounted(() => {
  canvas.removeEventListener('mousedown')
  canvas.removeEventListener('mousemove')
  canvas.removeEventListener('mouseleave')
  canvas.removeEventListener('mouseup')
})
</script>

<template>
  <div class="wb--container">
    <div class="wb--container--controls">
      <div class="wb--container--controls--pen">
        <div
          v-for="i in 5"
          :key="i"
          class="wb--container--controls--pen__size"
          :class="{ 'opacity-40': !currentLineWidth(i) }"
          :style="`background-color:${drawColor}`"
          @click="setLineWidth($event)"
        />
      </div>
      <div class="wb--container--controls--palette">
        <div
          v-for="(color, index) in colorPalette"
          :key="index"
          class="w-8 h-8 wb--container--controls--palette__color"
          :style="`background-color:${color}`"
          @click="drawColor = color"
        />
      </div>

      <div class="wb--container--controls__clearBtn">
        <button @click="clearCanvas">
          Clear
        </button>
      </div>
    </div>
    <div class="wb--container--canvas">
      <canvas id="canvas" ref="canvas" />
    </div>
  </div>
</template>

<style lang="scss">
.wb--container {
  display: flex;
  flex-direction: column;

  .wb--container--controls {
    padding: 1rem;
    background-color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &--pen {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;

      &__size {
        background-color: black;
        border-radius: 50%;
        margin: 3px;
      }

      &__size:nth-child(1) {
        width: 5px;
        height: 5px;
      }

      &__size:nth-child(2) {
        width: 10px;
        height: 10px;
      }

      &__size:nth-child(3) {
        width: 15px;
        height: 15px;
      }

      &__size:nth-child(4) {
        width: 20px;
        height: 20px;
      }

      &__size:nth-child(5) {
        width: 25px;
        height: 25px;
      }

      &__size:hover {
        cursor: pointer;
        opacity: 1 !important;
      }
    }

    &--palette {
      margin: 25px 0px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 0 1.5rem;

      &__color {
        margin: 0 0.04rem;
        border-radius: 0.25rem;
        transition: all 120ms;
      }
      &__color:hover {
        transform: scale(1.2);
        border-radius: 50%;
        cursor: pointer;
        z-index: 1;
      }
    }
  }

  .wb--container--canvas {
    #canvas {
      width: 100%;
      color: white;
      background-color: white;
      cursor: crosshair;
    }
  }
}
</style>
