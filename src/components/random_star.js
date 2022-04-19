import { range } from 'd3'

const width = window.innerWidth,
      height = window.innerHeight,
      margin = { 'top': 20, 'right': 20, 'bottom': 20, 'left': 20 },
      innerWidth = width - (margin['left'] + margin['right']),
      innerHeight = height - (margin['top'] + margin['bottom']),
      midX = innerWidth / 2,
      midY = innerHeight / 2

const arr = range(100)

export const RandomStar = () => {

  return (
    <svg style={{ background: '#eee' }} width={width} height={height}>
      <g transform={`translate(${margin['top']}, ${margin['left']})`}>
        <circle key={Math.random()} cx={midX} cy={midY} r='10' />
        { arr.map(d => (
          <line key={Math.random()} x1={midX} y1={midY} x2={Math.random() * innerWidth} y2={Math.random() * innerHeight} stroke='black' />
        )) }
      </g>
    </svg>
  )
}