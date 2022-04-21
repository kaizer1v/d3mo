import { stack, range } from 'd3'

const width = window.innerWidth,
      height = window.innerHeight,
      margin = { 'top': 20, 'right': 20, 'bottom': 50, 'left': 200 },
      innerWidth = width - (margin['left'] + margin['right']),
      innerHeight = height - (margin['top'] + margin['bottom'])

export const Stacks = () => {

  return (
    <svg width={width} height={height} style={{ background: '#eee' }}>
    </svg>
  )
}