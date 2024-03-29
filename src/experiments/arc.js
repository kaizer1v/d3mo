import { arc, range } from 'd3'
import { useState } from 'react'

const width = window.innerWidth,
      height = window.innerHeight,
      margin = { 'top': 20, 'right': 20, 'bottom': 50, 'left': 200 },
      innerWidth = width - (margin['left'] + margin['right']),
      innerHeight = height - (margin['top'] + margin['bottom'])

const arr = range(0, 250, 10),
      arcWidth = 10

export const Curves = () => {

  const [iRadius, setIRadius] = useState(1)
  const [oRadius, setORadius] = useState(1)
  // const [eAngle, setEAngle] = useState()

  const getCurve = (n, i) => {
    return arc()
      .innerRadius(n * iRadius)
      .outerRadius(n * oRadius + arcWidth)
      .startAngle(0)
      .endAngle(Math.PI * Math.sqrt(i)/10 * 4)
      .cornerRadius(arcWidth / 2)
  }

  return (
    <>
      <input type='range' name='volume' min='1' max='11' onChange={ (e) => setIRadius(+e.target.value) } />
      <label>InnerRadius</label>

      <input type='range' name='volume' min='1' max='11' onChange={ (e) => setORadius(+e.target.value) } />
      <label>OuterRadius</label>

      <svg width={width} height={height} style={{ background: '#eee' }}>
        <g transform={`translate(${innerWidth / 2}, ${innerHeight / 2})`}>
          { arr.map((n, i) => <path key={i} fill='none' storke-width='1' stroke='black' d={getCurve(n, i)()} />) }
          { arr.map((n, i) => <rect width='10' height='5' fill='red' x={getCurve(n, i)()} y='10' />) }
        </g>
        <circle cx={innerWidth / 2} cy={innerHeight / 2} r='5' />
      </svg>
    </>
  )
}