import { arc, line, lineRadial, range, scaleRadial, scaleLinear, curveBasis } from 'd3'
import { useState } from 'react'

const width = window.innerWidth,
      height = window.innerHeight,
      margin = { 'top': 20, 'right': 20, 'bottom': 50, 'left': 200 },
      innerWidth = width - (margin['left'] + margin['right']),
      innerHeight = height - (margin['top'] + margin['bottom']),
      lineData = [
        {date: new Date(2007, 3, 24), value: 93.24},
        {date: new Date(2007, 3, 25), value: 95.35},
        {date: new Date(2007, 3, 26), value: 98.84},
        {date: new Date(2007, 3, 27), value: 99.92},
        {date: new Date(2007, 3, 30), value: 99.80},
        {date: new Date(2007, 4,  1), value: 99.47}
      ]

const arr = range(0, 100),
      arcWidth = 20

export const RadialStuff = () => {

  const [iRadius, setIRadius] = useState(1)
  const [oRadius, setORadius] = useState(1)
  // const [eAngle, setEAngle] = useState()

  const hourScale = scaleLinear()
    .domain([0, 12])
    .range([0, Math.PI * 2])

  const minuteScale = scaleLinear()
    .domain([0, 60])
    .range([0, Math.PI * 2])

  const circScale = scaleRadial()
    .domain([0, 60])
    .range([0, Math.PI * 2])

  const hourArc = arc()
    .innerRadius(99)
    .outerRadius(100)
    .startAngle(0)
    .endAngle(hourScale(6))
    .cornerRadius(10)

  const minuteArc = arc()
    .innerRadius(120)
    .outerRadius(140)
    .startAngle(0)
    .endAngle(minuteScale(45))
    .cornerRadius(10)


  /**
   *  line contains an array of x & y coordinates
   *  [ [ x1, y1 ], [ x2, y2 ], ... ]
   **/
  const drawLine = line()([[10, 40], [40, 90], [60, 10], [190, 10]])

  /**
   * lineRadial also takes a similar input, but instead it internally
   * calculates the `angle` and the `radius` of the coordinates
   *
   * [ [ angle1, radius1 ], [ angle2, radius2 ], ... ]
   **/


  /* [{ 'angle': 0, 'radius': 10 }, ...] */
  const radData = range(0, 100).map((d, i) => {
    return { 'angle': i, 'radius': Math.PI * i }
  })
  const drawRadialLine = lineRadial()
    .angle(d => d.angle)
    .radius(d => d.radius)
    .curve(curveBasis)
      (radData)

  return (
    <svg width={width} height={height} style={{ background: '#eee' }}>
      <g transform={`translate(${innerWidth / 2}, ${innerHeight / 2})`}>
        <path d={hourArc()} fill='red' />
        <path d={minuteArc()} fill='red' />

        <path d={ drawRadialLine } stroke='purple' strokeWidth='4' fill='none' />
      </g>
    </svg>
  )
}