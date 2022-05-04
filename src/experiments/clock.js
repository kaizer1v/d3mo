import { scaleRadial, scaleLinear, range } from 'd3'
import { useState } from 'react'


const width = window.innerWidth,
      height = window.innerHeight,
      margin = { 'top': 20, 'right': 20, 'bottom': 50, 'left': 200 },
      innerWidth = width - (margin['left'] + margin['right']),
      innerHeight = height - (margin['top'] + margin['bottom']),
      innerRadius = 200,
      outerRadius = 300,
      radians = Math.PI / 180


// for every number b/w 1-12 give a corresponding value b/w 0-360 and use this as a rotation angle scale
const hours = scaleLinear()
  .domain([0, 12])
  .range([0, 360])

// for every number b/w 1-60 give a corresponding value b/w 0-360 and use this as a rotation angle scale
const minutes = scaleLinear()
  .domain([0, 60])
  .range([0, 360])


export const Clock = () => {

  const [time, setTime] = useState(new Date())

  const interval = setInterval(() => {
    setTime(new Date())
  }, 1000)

  const hour = (time.getHours() % 12) + time.getMinutes() / 60,
        minute = time.getMinutes(),
        second = time.getSeconds()

  return (
    <>
      <svg width={width} height={height} style={{ background: '#eee' }}>
        <g transform={`translate(${innerWidth / 2}, ${innerHeight / 2}) rotate(180)`}>

          <g className='hour-ticks'>
            { range(0, 12).map((h, i) =>
              <line
                className='hour-tick'
                x1='0' y1={innerRadius}
                x2='0' y2={innerRadius + 10}
                stroke='black'
                strokeWidth='5'
                transform={`rotate(${hours(i)})`}
              />
            )}
          </g>

          <g className='minute-ticks'>
            { range(0, 60).map((h, i) =>
              <line
                className='hour-tick'
                x1='0' y1={innerRadius}
                x2='0' y2={innerRadius + 5}
                stroke='black'
                strokeWidth='2'
                transform={`rotate(${minutes(i)})`}
              />
            )}
          </g>

          <g className='hands'>
            <line
              className='hour-tick'
              x1='0' y1='0'
              x2='0' y2={innerRadius - 5}
              stroke='black'
              strokeWidth='4'
              strokeLinecap="butt"
              transform={`rotate(${minutes(minute)})`}
            />

            <line
              className='hour-tick'
              x1='0' y1='0'
              x2='0' y2={innerRadius - 5}
              stroke='black'
              strokeWidth='1'
              transform={`rotate(${minutes(second)})`}
            />

            <line
              className='hour-tick'
              x1='0' y1='0'
              x2='0' y2={innerRadius - 100}
              stroke='black'
              strokeWidth='6'
              transform={`rotate(${hours(hour)})`}
            />
          </g>

          <circle cx='0' cy='0' r='5' strokeWidth='1' stroke='black' fill='#fff' />
        </g>
      </svg>
    </>
  )
}