<script setup lang="ts">
import MineBlock from '../components/MineBlock.vue'
import { isDev, toggleDev } from '~/composables'
import { GamePlay } from '~/composables/logic'

const play = new GamePlay(6, 6, 2)
useStorage('minesweeper-state', play.state)
const state = computed(() => play.board)

const mineCount = computed(() => {
  return play.blocks.reduce((a, b) => a + (b.mine ? 1 : 0), 0)
})
watchEffect(() => {
  play.checkGameState()
})
</script>

<template>
  <div>
    <h1>Minesweeper</h1>
    <div p5 w-auto overflow-auto>
      <div
        v-for="row,y in state"
        :key="y"
        flex="~"
        items-center justify-center w-max ma
      >
        <MineBlock
          v-for="block,x in row" :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        />
      </div>
    </div>

    <div>
      Count : {{ mineCount }}
    </div>

    <div flex="~ gap-1" justify-center>
      <button btn @click="toggleDev()">
        {{ isDev ? 'Normal' : 'Dev' }}
      </button>
      <button btn @click="play.reset()">
        Reset
      </button>
    </div>
    <Confetti :passed="play.state.value.gameState === 'won'" />
  </div>
</template>
