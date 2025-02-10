<script setup lang="ts">
import rough from 'roughjs'
import type { RoughCanvas } from 'roughjs/bin/canvas'
import type { Drawable } from 'roughjs/bin/core'
import { getStroke } from 'perfect-freehand'
import {
  createHistoryPoint,
  getLastHistoryPoint,
  getLastLocalRedo,
  getLocalHistory,
  removeLastLocalRedo,
  storeRedoPoint,
} from '@/utils/whiteboard/history'
import {
  adjustElementCoordinates,
  cursorForPosition,
  getArrowPoints,
  getSvgPathFromStroke,
  positionWithinElement,
  resizedCoordinates,
} from '@/utils/whiteboard/utils'
import { ActionTypes, ToolTypes, positionNames } from '@/types/whiteboardTypes'
import type { Element, ElementType } from '@/types/whiteboardTypes'

defineEmits<{
  (e: 'toggleChatVisibility'): void
  (e: 'close'): void
}>()

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
let roughCanvas: RoughCanvas

const { width: windowInnerWidth, height: windowInnerHeight } = useWindowSize()

const generator = rough.generator()

const elements = ref<Element[]>([])
let action = ActionTypes.NONE
const toolType = ref<ElementType>(ToolTypes.SELECTION)
let selectedElement: (Element & { offsetX: number; offsetY: number }) | null

const panOffset = reactive({ x: 0, y: 0 })
const startPanMousePosition = reactive({ x: 0, y: 0 })

const scale = ref(1)

let undoIndex = 0

onMounted(() => {
  canvas = document.getElementById('canvas') as HTMLCanvasElement
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  roughCanvas = rough.canvas(canvas)
  draw()
})

useEventListener('resize', () => {
  reDraw()
})
useEventListener('keydown', (event) => {
  const ctrlKey = event.ctrlKey || event.altKey
  if (
    (event.code === 'KeyY' && ctrlKey)
    || (event.code === 'KeyZ' && ctrlKey && event.shiftKey)
  )
    Redo()
  else if (event.code === 'KeyZ' && ctrlKey)
    Undo()
})

function createElement(
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type?: ElementType,
) {
  let roughElement
  switch (type) {
    case ToolTypes.ARROW:
      roughElement = generator.linearPath(getArrowPoints(x1, y1, x2, y2), {
        stroke: 'black',
        strokeWidth: 2,
      })
      break
    case ToolTypes.LINE:
      roughElement = generator.line(x1, y1, x2, y2)
      break
    case ToolTypes.RECTANGLE:
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1)
      break
    case ToolTypes.PENCIL:
      return { id, type, points: [[x1, y1]] }
    default:
      throw new Error('Invalid tool type')
  }

  return { id, x1, y1, x2, y2, type, roughElement, position: '' }
}

function updateElement(
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type?: ElementType,
) {
  const elementToolType = type || toolType.value
  const elementsCopy = [...elements.value]
  if (elementToolType === ToolTypes.PENCIL) {
    elementsCopy[id]?.points?.push([x2, y2])
  }
  else {
    const updatedElement = createElement(id, x1, y1, x2, y2, elementToolType)
    elementsCopy[id] = updatedElement as Element
  }
  elements.value = elementsCopy
  reDraw()
}

function handleMouseDown(event: MouseEvent) {
  const { clientX, clientY } = getMouseCoordinates(event)

  if (event.button === 1) {
    event.preventDefault()
    action = ActionTypes.PANNING
    startPanMousePosition.x = clientX
    startPanMousePosition.y = clientY
    canvas.style.cursor = 'move'
    return
  }

  if (
    toolType.value === ToolTypes.SELECTION
    || toolType.value === ToolTypes.DELETE
  ) {
    const element = getElementAtPosition(clientX, clientY)
    if (
      !element
      || (toolType.value !== ToolTypes.DELETE && element.type === ToolTypes.PENCIL)
    )
      return
    const offsetX = clientX - element.x1
    const offsetY = clientY - element.y1
    selectedElement = { ...(element as Element), offsetX, offsetY }
    if (toolType.value === ToolTypes.DELETE) {
      action = ActionTypes.DELETING
    }
    else {
      action
        = element.position === positionNames.inside
          ? ActionTypes.MOVING
          : ActionTypes.RESIZING
    }

    const { x1, y1, x2, y2, points, type } = selectedElement
    createHistoryPoint(
      element.id,
      action,
      type,
      undoIndex,
      x1,
      y1,
      x2,
      y2,
      points,
    )
    undoIndex = 0
  }
  else {
    const newElement = createElement(
      elements.value.length,
      clientX,
      clientY,
      clientX,
      clientY,
      toolType.value,
    )
    elements.value.push(newElement as Element)
    selectedElement = { ...newElement, offsetX: 0, offsetY: 0 } as Element & {
      offsetX: number
      offsetY: number
    }
    reDraw()
    action = ActionTypes.DRAWING
    createHistoryPoint(
      newElement.id,
      ActionTypes.DRAWING,
      newElement.type,
      undoIndex,
      newElement.x1,
      newElement.y1,
      newElement.x2,
      newElement.y2,
    )
    undoIndex = 0
  }
}

function handleMouseMove(event: MouseEvent) {
  const { clientX, clientY } = getMouseCoordinates(event)

  if (action === ActionTypes.PANNING) {
    const deltaX = clientX - startPanMousePosition.x
    const deltaY = clientY - startPanMousePosition.y
    panOffset.x += deltaX
    panOffset.y += deltaY
    reDraw()
    return
  }

  (event.target as HTMLElement).style.cursor = 'default'
  if (toolType.value === ToolTypes.SELECTION) {
    const element = getElementAtPosition(clientX, clientY);
    (event.target as HTMLElement).style.cursor
      = element && element.type !== ToolTypes.PENCIL
        ? cursorForPosition(element.position as string)
        : 'default'
  }
  if (toolType.value === ToolTypes.DELETE) {
    const svgData = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M13.083 19.063c-.444.444-.843.843-1.21 1.187H21a.75.75 0 0 1 0 1.5H9q-.028 0-.055-.002c-.703-.027-1.3-.331-1.886-.778c-.588-.448-1.244-1.104-2.046-1.907l-.076-.076c-.803-.802-1.459-1.458-1.907-2.046c-.468-.614-.78-1.24-.78-1.989c0-.748.312-1.375.78-1.989c.448-.587 1.104-1.243 1.907-2.046l5.98-5.98c.803-.803 1.459-1.459 2.046-1.907c.614-.468 1.24-.78 1.99-.78c.748 0 1.374.312 1.988.78c.588.448 1.244 1.104 2.046 1.907l.076.076c.803.802 1.459 1.458 1.907 2.046c.468.614.78 1.24.78 1.989c0 .748-.312 1.375-.78 1.989c-.448.587-1.104 1.243-1.907 2.046zM11.94 6.035c.85-.85 1.435-1.433 1.933-1.812c.48-.367.79-.473 1.08-.473c.288 0 .598.106 1.079.473c.497.38 1.083.962 1.933 1.812s1.433 1.436 1.813 1.933c.366.481.472.79.472 1.08c0 .289-.106.599-.473 1.079c-.38.498-.962 1.083-1.812 1.933l-4.194 4.193l-6.024-6.024zM9.048 20.25c.289 0 .599-.106 1.079-.473c.498-.38 1.083-.962 1.933-1.812l.65-.651l-6.024-6.025l-.65.65c-.85.85-1.434 1.436-1.813 1.934c-.367.48-.473.79-.473 1.08c0 .288.106.598.473 1.079c.38.497.962 1.083 1.812 1.933s1.436 1.433 1.933 1.813c.481.366.79.472 1.08.472" clip-rule="evenodd"/></svg>
    `)
    const cursorUrl = `data:image/svg+xml;charset=utf-8,${svgData}`;
    (event.target as HTMLElement).style.cursor = `url(${cursorUrl}), auto`
  }
  if (toolType.value === ToolTypes.PENCIL)
    (event.target as HTMLElement).style.cursor = 'crosshair'

  if (action === ActionTypes.DRAWING) {
    const index = elements.value.length - 1
    const { x1, y1 } = elements.value[index]
    updateElement(index, x1, y1, clientX, clientY)
  }
  else if (action === ActionTypes.MOVING) {
    if (selectedElement) {
      const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement
      const newX1 = clientX - offsetX
      const newY1 = clientY - offsetY
      updateElement(
        id,
        newX1,
        newY1,
        newX1 + (x2 - x1),
        newY1 + (y2 - y1),
        type,
      )
    }
  }
  else if (action === ActionTypes.RESIZING) {
    if (selectedElement) {
      const { id, type, position, ...coordinates } = selectedElement
      const { x1, y1, x2, y2 } = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates,
      )
      updateElement(id, x1, y1, x2, y2, type)
    }
  }
}

function handleMouseUp() {
  if (selectedElement) {
    const index = selectedElement.id
    const { id, type } = elements.value.find(
      element => element.id === index,
    ) as Element
    if (
      (action === ActionTypes.DRAWING || action === ActionTypes.RESIZING)
      && adjustmentRequired(type)
    ) {
      const { x1, y1, x2, y2 } = adjustElementCoordinates(
        elements.value[index] as Element,
      )
      updateElement(id, x1, y1, x2, y2, type)
    }
    else if (action === ActionTypes.DELETING) {
      const index = selectedElement.id
      elements.value = elements.value.filter(element => element.id !== index)
      reDraw()
    }
  }
  action = ActionTypes.NONE
  selectedElement = null
}

function draw() {
  elements.value?.forEach((element) => {
    if (element?.type !== ToolTypes.PENCIL && element?.roughElement) {
      roughCanvas.draw(element.roughElement as Drawable)
    }
    else {
      if (element?.points) {
        const outlinePoints = getStroke(element.points, {
          size: 6,
          smoothing: 0.5,
          thinning: 0.5,
          streamline: 1,
          easing: t => t,
        })
        const pathData = getSvgPathFromStroke(outlinePoints)
        const myPath = new Path2D(pathData)
        ctx.fill(myPath)
      }
    }
  })
}

function reDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  const scaleOffsetX = (canvas.width * scale.value - canvas.width) / 2
  const scaleOffsetY = (canvas.height * scale.value - canvas.height) / 2
  ctx.translate(
    panOffset.x * scale.value - scaleOffsetX,
    panOffset.y * scale.value - scaleOffsetY,
  )
  ctx.scale(scale.value, scale.value)
  draw()
  ctx.restore()
}

function adjustmentRequired(type: ElementType) {
  return [ToolTypes.ARROW, ToolTypes.LINE, ToolTypes.RECTANGLE].includes(
    type as 'arrow' | 'line' | 'rectangle',
  )
}

function getElementAtPosition(x: number, y: number) {
  return elements.value
    .map(element => ({
      ...element,
      position: positionWithinElement(x, y, element as Element),
    }))
    .find(element => !!element.position)
}

function Undo() {
  const lastAction = getLastHistoryPoint(undoIndex)
  const elementCopy
    = elements.value.find((element) => {
      return element?.id === lastAction?.id
    }) || {}
  if (lastAction) {
    const { id, actionType, x1, y1, x2, y2, points, type } = lastAction
    if (actionType === ActionTypes.DRAWING) {
      elements.value = elements.value.filter(element => element.id !== id)
    }
    else {
      type === ToolTypes.PENCIL
        ? elements.value.push({ id, type, points } as Element)
        : updateElement(id, x1, y1, x2, y2, type)
    }
    if (Object.keys(elementCopy).length) {
      const { id, x1, y1, x2, y2, points, type } = elementCopy as Element
      storeRedoPoint(id, lastAction.actionType, type, x1, y1, x2, y2, points)
    }
    else if (actionType === ActionTypes.DELETING) {
      storeRedoPoint(id, lastAction.actionType, type, x1, y1, x2, y2, points)
    }
  }
  reDraw()
  undoIndex < getLocalHistory().length && undoIndex++
}

function Redo() {
  const redoElement = getLastLocalRedo()
  if (redoElement) {
    const { id, actionType, x1, y1, x2, y2, points, type } = redoElement
    if (actionType === ActionTypes.DELETING) {
      elements.value = elements.value.filter(element => element.id !== id)
      reDraw()
    }
    else if (
      elements.value.findIndex(element => element.id === id) === -1
    ) {
      if (type === ToolTypes.PENCIL && points) {
        elements.value.push({ id, type, points } as Element)
      }
      else {
        const newElement = createElement(id, x1, y1, x2, y2, type) as Element
        elements.value.push(newElement)
        updateElement(
          newElement.id,
          newElement.x1,
          newElement.y1,
          newElement.x2,
          newElement.y2,
          newElement.type,
        )
      }
    }
    else {
      updateElement(id, x1, y1, x2, y2, type)
    }
  }
  reDraw()
  removeLastLocalRedo()
  undoIndex > 0 && undoIndex--
}

function onZoom(delta: number) {
  scale.value = Math.min(Math.max(scale.value + delta, 0.1), 2)
  reDraw()
}

function resetZoom() {
  scale.value = 1
  reDraw()
}

function getMouseCoordinates(event: MouseEvent) {
  const scaleOffsetX = (canvas.width * scale.value - canvas.width) / 2
  const scaleOffsetY = (canvas.height * scale.value - canvas.height) / 2
  return {
    clientX:
      (event.clientX - panOffset.x * scale.value + scaleOffsetX) / scale.value,
    clientY:
      (event.clientY - panOffset.y * scale.value + scaleOffsetY) / scale.value,
  }
}

function emptyWhiteboard() {
  elements.value.length = 0
  reDraw()

  // TODO: remove them after sockets
  localStorage.removeItem('history')
  localStorage.removeItem('redo')
}

useEventListener(
  'wheel',
  (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      event.preventDefault()
      onZoom(event.deltaY * -0.001)
    }
    else {
      panOffset.x -= event.deltaX
      panOffset.y -= event.deltaY
    }
    reDraw()
  },
  { passive: false },
)
</script>

<template>
  <div class="whiteboard-container relative h-full bg-off-white">
    <WhiteboardToolbar
      @close-whiteboard="$emit('close')"
      @toggle-chat-visibility="$emit('toggleChatVisibility')"
      @empty-whiteboard="emptyWhiteboard"
      @tool-selection="toolType = $event"
    />
    <canvas
      id="canvas"
      style="position: absolute; z-index: 1; overflow: hidden"
      :width="windowInnerWidth"
      :height="windowInnerHeight"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
    />
    <div class="absolute bottom-5 left-5 z-10">
      <button class="cursor-pointer p-2 bg-orange-100 rounded-l-lg hover:bg-orange-200" @click="onZoom(-0.1)">
        <Icon name="majesticons:minus-line" size="1.3rem" />
      </button>
      <button class="cursor-pointer p-2 bg-orange-100 hover:bg-orange-200" @click="resetZoom">
        {{ new Intl.NumberFormat('en-US', { style: 'percent' }).format(scale) }}
      </button>
      <button class="cursor-pointer p-2 bg-orange-100 hover:bg-orange-200 rounded-r-lg" @click="onZoom(0.1)">
        <Icon name="majesticons:plus-line" size="1.3rem" />
      </button>
      <button class="cursor-pointer ml-4 p-2 bg-orange-100 hover:bg-orange-200 rounded-l-lg" @click="Undo">
        <Icon name="majesticons:undo" size="1.3rem" />
      </button>
      <button class="cursor-pointer p-2 bg-orange-100 hover:bg-orange-200 rounded-r-lg" @click="Redo">
        <Icon name="majesticons:redo" size="1.3rem" />
      </button>
    </div>
  </div>
</template>
