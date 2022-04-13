import type { BlockState } from '~/types'

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

export class GamePlay {
  state = ref<BlockState[][]>([])
  mineGenerated = false

  constructor(public width: number, public height: number) {
    // watchEffect(this.checkGameState)
    this.reset()
  }

  reset() {
    this.mineGenerated = false
    this.state.value = Array.from({ length: this.height }, (_, y) =>
      Array.from({ length: this.width }, (_, x): BlockState => ({
        x, y, adjacentMines: 0, reveald: false,
      })))
  }

  generateMines(state: BlockState[][], initial: BlockState) {
    for (const row of state) {
      for (const block of row) {
        if (Math.abs(block.x - initial.x) < 1)
          continue
        if (Math.abs(block.y - initial.y) < 1)
          continue
        block.mine = Math.random() < 0.1
      }
    }
    this.updateNumbers()
  }

  updateNumbers() {
    this.state.value.forEach((row) => {
      row.forEach((block) => {
        if (block.mine)
          return

        this.getSliblings(block).forEach((b) => {
          if (b.mine)
            block.adjacentMines += 1
        })
      })
    })
  }

  getSliblings(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined
      return this.state.value[y2][x2]
    }).filter(Boolean) as BlockState[]
  }

  expendZero(block: BlockState) {
    if (block.adjacentMines)
      return

    this.getSliblings(block).forEach((b) => {
      if (!b.reveald) {
        b.reveald = true
        this.expendZero(b)
      }
    })
  }

  onClick(block: BlockState) {
    if (!this.mineGenerated) {
      this.generateMines(this.state.value, block)
      this.mineGenerated = true
    }

    block.reveald = true
    if (block.mine)
      alert('BOOOM!')
    this.expendZero(block)
  }

  onRightClick(block: BlockState) {
    if (block.reveald)
      return
    block.flagged = !block.flagged
  }

  checkGameState() {
    // console.log('checkGameState')
    if (!this.mineGenerated)
      return
    const blocks = this.state.value.flat()
    if (blocks.every(block => block.reveald || (block.flagged && block.mine))) {
      if (blocks.every(block => block.flagged && !block.mine))
        alert('You cheat!')
      else
        alert('You win!')
    }
  }
}
