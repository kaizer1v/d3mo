import { range } from 'd3'

const width = window.innerWidth,
      height = window.innerHeight,
      margin = { 'top': 20, 'right': 20, 'bottom': 20, 'left': 20 },
      innerWidth = width - (margin['left'] + margin['right']),
      innerHeight = height - (margin['top'] + margin['bottom']),
      midX = innerWidth / 2,
      midY = innerHeight / 2

const scaleFunction = (n) => n * n
const arr = range(1000)

export const SquaredNumbers = () => {
  return (
    <svg style={{ background: '#eee' }} width={width} height={height}>
      <g transform={`translate(${margin['top']}, ${margin['left']})`}>
      {
        arr.map((d, i) => {
          if(i % 30 == 0 && i < 120) return (<text x={d}>{d}</text>)

          return (
            <g>
              <text x='100' y={scaleFunction(d)}>{scaleFunction(d)}</text>
              <circle
                cx={d}
                cy={scaleFunction(d)}
                r='5'
                fill='none'
                stroke='black'
                stroke-width='1'
              />
            </g>
          )
        })
      }
      </g>
    </svg>
  )
}