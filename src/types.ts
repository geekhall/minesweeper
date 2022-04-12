export interface BlockState{
  x: number
  y: number
  reveald: boolean
  mine?: boolean
  flagged?: boolean
  adjacentMines: number
}
