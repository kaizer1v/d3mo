import { useState, useCallback } from 'react'
import { range } from 'd3'

const width = window.innerWidth,
      height = window.innerHeight,
      margin = { 'top': 20, 'right': 20, 'bottom': 20, 'left': 20 },
      innerWidth = width - (margin['left'] + margin['right']),
      innerHeight = height - (margin['top'] + margin['bottom']),
      midX = innerWidth / 2,
      midY = innerHeight / 2,
      stars = range(100)

export const MovingStar = () => {
  const [pos, updatePos] = useState({ x: 10, y: 10 })

  const handleMouseMove = useCallback(({ clientX, clientY }) => {
    updatePos({ x: clientX, y: clientY })
  }, [updatePos])

  return (
    <svg style={{ background: '#eee' }} width={width} height={height} onMouseMove={handleMouseMove}>
      <g transform={`translate(${margin['top']}, ${margin['left']})`}>
        <circle cx={midX} cy={midY} r='10' />
        {
          stars.map(d =>
            <line
              key={Math.random() * pos.x}
              x1={midX}
              y1={midY}
              x2={Math.random() * pos.x * Math.PI}
              y2={Math.random() * pos.y * 2}
              stroke='black'
            />
          )
        }
      </g>
    </svg>
  )
}