<script setup lang="ts">
import MineBlock from '../components/MineBlock.vue'
import { isDev, toggleDev } from '~/composables'
import { GamePlay } from '~/composables/logic'

// const play = $ref(new GamePlay(6, 6, 2))
const play = new GamePlay(6, 6, 2)
const now = $(useNow())
// const start = new Date()
const countdown = $computed(() => Math.round((+now - +play.state.value.startMS) / 1000))
useStorage('minesweeper-state', play.state)
const state = computed(() => play.board)

const mineRest = $computed(() => {
  if (!play.state.value.mineGenerated)
    return play.mines
  return play.blocks.reduce(
    (pre, current) => pre + (current.mine ? 1 : 0) - (current.flagged ? 1 : 0), 0)
})

function newGame(difficulty: 'easy'| 'medium' | 'hard') {
  switch (difficulty) {
    case 'easy':
      play.reset(9, 9, 10)
      break
    case 'medium':
      play.reset(16, 16, 40)
      break
    case 'hard':
      play.reset(16, 30, 99)
      break
  }
}

watchEffect(() => {
  play.checkGameState()
})

</script>

<template>
  <div>
    <h1>Minesweeper</h1>
    <div flex="~ gap1" justify-center p4>
      <button btn @click="play.reset()">
        NewGame
      </button>
      <button btn @click="newGame('easy')">
        Easy
      </button>
      <button btn @click="newGame('medium')">
        Medium
      </button>
      <button btn @click="newGame('hard')">
        Hard
      </button>
    </div>
    <div flex="~ gap-10" justify-center>
      <div text-2xl flex="~ gap-1" items-center>
        <div i-mdi-timer />{{ countdown }}
      </div>
      <div text-2xl flex="~ gap-1" items-center>
        <div i-mdi-mine />{{ mineRest }}
      </div>
    </div>
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

    <!-- <div flex="~ gap-1" justify-center>
      <button btn @click="toggleDev()">
        {{ isDev ? 'Normal' : 'Dev' }}
      </button>
      <button btn @click="play.reset()">
        New Game
      </button>
    </div> -->
    <!-- <Confetti :passed="play.state.value.gameState === 'won'" /> -->
    <Confetti :passed="play.state.value.gameState === 'won'" />
  </div>
</template>
