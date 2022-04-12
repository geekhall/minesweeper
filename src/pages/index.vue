<script setup lang="ts">
import type { BlockState } from '~/types'

const WIDTH = 5
const HEIGHT = 5
const state = ref(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x): BlockState => ({
      x, y, adjacentMines: 0, reveald: false,
    }))),
)

function generateMines(initial: BlockState) {
  for (const row of state.value) {
    for (const block of row) {
      if (Math.abs(block.x - initial.x) < 1)
        continue
      if (Math.abs(block.y - initial.y) < 1)
        continue
      block.mine = Math.random() < 0.1
    }
  }
  updateNumbers()
}
const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
]

const numberColors = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500',
]

function updateNumbers() {
  state.value.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine)
        return

      getSliblings(block).forEach((b) => {
        if (b.mine)
          block.adjacentMines += 1
      })
    })
  })
}

function getSliblings(block: BlockState) {
  return directions.map(([dx, dy]) => {
    const x2 = block.x + dx
    const y2 = block.y + dy
    if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
      return undefined
    return state.value[y2][x2]
  }).filter(Boolean) as BlockState[]
}

function expendZero(block: BlockState) {
  if (block.adjacentMines)
    return

  getSliblings(block).forEach((b) => {
    if (!b.reveald) {
      b.reveald = true
      expendZero(b)
    }
  })
}
let mineGenerated = false
const dev = false

function onClick(e: MouseEvent, block: BlockState) {
  // console.log(`clicked at ${block.x}, ${block.y}`)
  if (!mineGenerated) {
    generateMines(block)
    mineGenerated = true
  }

  block.reveald = true
  if (block.mine)
    alert('BOOOM!')
  expendZero(block)
}

function onRightClick(block: BlockState) {
  if (block.reveald)
    return
  block.flagged = !block.flagged
}
function getBlockClass(block: BlockState) {
  // hover="bg-gray/10"
  if (block.flagged)
    return 'bg-gray-500/10'
  if (!block.reveald)
    return 'bg-gray-500/10 hover:bg-gray/10'
  return block.mine
    ? 'bg-red-500/50'
    : numberColors[block.adjacentMines]
}
watchEffect(checkGameState)
function checkGameState() {
  if (!mineGenerated)
    return
  const blocks = state.value.flat()
  if (blocks.every(block => block.reveald || (block.flagged && block.mine))) {
    if (blocks.every(block => block.flagged && !block.mine))
      alert('You cheat!')
    else
      alert('You win!')
  }
}
</script>

<template>
  <div>
    <h1>Minesweeper</h1>
    <div p5>
      <div
        v-for="row,y in state"
        :key="y"
        flex="~"
        items-center justify-center
      >
        <button
          v-for="block,x in row"
          :key="x"
          flex="~ col grow 1"
          border="1 gray-400/10"
          items-center justify-center
          w-10 h-10
          :class="getBlockClass(block)"
          @click="onClick($event, block)"
          @contextmenu.prevent="onRightClick(block)"
        >
          <!-- {{ item.mine? 'X' : item.adjacentMines }} -->
          <template v-if="block.flagged">
            <div i-mdi-flag text-red />
          </template>
          <template v-if="block.reveald || dev">
            <div v-if="block.mine" i-mdi-mine />
            <div v-else>
              {{ block.adjacentMines }}
            </div>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
