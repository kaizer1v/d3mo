import { lineRadial, range, scaleRadial, curveBasis, curveBundle } from 'd3'
import { useState } from 'react'

const width = window.innerWidth,
      height = window.innerHeight,
      margin = { 'top': 20, 'right': 20, 'bottom': 50, 'left': 200 },
      innerWidth = width - (margin['left'] + margin['right']),
      innerHeight = height - (margin['top'] + margin['bottom'])

export const RadialStuff = () => {

  /* [{ 'angle': 0, 'radius': 10 }, ...] */
  // const [radData,  setRadData]  = useState({ total: 100, angle: 1, radius: 1 })
  // const [radius, setRadius] = useState(Math.PI * 5)
  // const [angle,  setAngle]  = useState(5)
  // const [rotate, setRotate] = useState(true)

  /**
   * lineRadial also takes a similar input, but instead it internally
   * calculates the `angle` and the `radius` of the coordinates
   *
   * [ [ angle1, radius1 ], [ angle2, radius2 ], ... ]
   **/

  const radData = range(0, 100).map((d, i) => {
    return { 'angle': i, 'radius': Math.PI * i }
  })


  const drawRadialLine = lineRadial()
    .angle(d => d.angle)
    .radius(d => d.radius)
    // .curve(curveBundle.beta(1))
    .curve(curveBasis)
      (radData)

  return (
    <>
      <svg width={width} height={height} style={{ background: '#eee' }}>
        <g transform={`translate(${innerWidth / 2}, ${innerHeight / 2})`}>
          <path
            d={ drawRadialLine }
            stroke='purple'
            strokeWidth='4'
            fill='none'
          />
        </g>
      </svg>
    </>
  )
}