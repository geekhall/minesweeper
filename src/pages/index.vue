<script setup lang="ts">
import MineBlock from '../components/MineBlock.vue'

import type { BlockState } from '~/types'
import { isDev, toggleDev } from '~/composables'
import { GamePlay } from '~/composables/logic'

const play = new GamePlay(10, 10)
const state = play.state
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
        <MineBlock
          v-for="block,x in row" :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        />
      </div>
    </div>
    <div flex="~ gap-1" justify-center>
      <button btn @click="toggleDev()">
        {{ isDev ? 'Normal' : 'Dev' }}
      </button>
      <button btn @click="play.reset()">
        Reset
      </button>
    </div>
  </div>
</template>
