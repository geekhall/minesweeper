<script setup lang="ts">
// pnpm install --save canvas-confetti

import confetti from 'canvas-confetti'
// import {isPassed} from '~/state'

const props = defineProps < {
  passed: boolean
}>()

function congrats() {
  const defaults = {
    colors: [
      '#5D8C7B',
      '#F3D090',
      '#F2A678',
      '#D9695D',
      '#8C4545',
    ],
    shapes: ['square'],
    ticks: 500,
  } as confetti.Options
  confetti({
    ...defaults,
    particalCount: 100,
    spread: 100,
    origin: { y: 0 },
  })
  setTimeout(() => {
    confetti({
      ...defaults,
      particalCount: 50,
      angle: 60,
      spread: 80,
      origin: { x: 0 },
    })
  }, 250)
  setTimeout(() => {
    confetti({
      ...defaults,
      particalCount: 50,
      angle: 120,
      spread: 80,
      origin: { x: 1 },
    })
  }, 400)
}

watch(() => props.passed, (v) => {
  if (v)
    setTimeout(congrats, 300)
}, { flush: 'post' })

</script>

<template>
  <div />
</template>

<style lang="sass" scoped>
</style>
