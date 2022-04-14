<script lang="ts" setup>
import type { BlockState } from '~/types'
import { isDev } from '~/composables'

defineProps<{ block: BlockState }>()

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

function getBlockClass(block: BlockState) {
  // hover="bg-gray/10"
  if (block.flagged)
    return 'bg-gray-500/10'
  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray/10'
  return block.mine
    ? 'bg-red-500/50'
    : numberColors[block.adjacentMines]
}
</script>

<template>
  <button
    flex="~"
    border="1 gray-400/10"
    items-center justify-center
    w-10 h-10 m="0.5"
    :class="getBlockClass(block)"
  >
    <!-- {{ item.mine? 'X' : item.adjacentMines }} -->
    <template v-if="block.flagged">
      <div i-mdi-flag text-red />
    </template>
    <template v-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi-mine />
      <div v-else font-bold>
        {{ block.adjacentMines }}
      </div>
    </template>
  </button>
</template>

<style lang="scss" scoped></style>
