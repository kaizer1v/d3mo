import { csv, line, scaleLinear, scaleTime, extent, timeFormat } from 'd3'
import { useState, useEffect } from 'react'

const url = 'https://gist.githubusercontent.com/curran/90240a6d88bdb1411467b21ea0769029/raw/week_temperature_sf.csv',
      width = window.innerWidth,
      height = window.innerHeight,
      margin = { 'top': 20, 'right': 20, 'bottom': 100, 'left': 100 },
      innerWidth = width - (margin['left'] + margin['right']),
      innerHeight = height - (margin['top'] + margin['bottom']),
      xVal = d => d['timestamp'],
      xLabel = 'Time',
      yVal = d => d['temperature'],
      yLabel = 'Temperature'

const AxisBottom = ({xScale, innerHeight}) => {
  return xScale.ticks().map(tickVal => (
    <g transform={`translate(${xScale(tickVal)}, 0)`}>
      <line y2={innerHeight} stroke='black' />
      <text style={{ textAnchor: 'middle' }} y={innerHeight + 5} dy='0.71em'>{timeFormat('%a')(tickVal)}</text>
    </g>
  ))
}

const AxisLeft = ({yScale}) => {
  return yScale.ticks().map(tickVal => (
    <text
      style={{ textAnchor: 'end' }}
      x='-10'
      y={yScale(tickVal)}
      dy='0.32em'
    >{tickVal}</text>
  ))
}

const Circles = ({data, xScale, yScale, xVal, yVal}) => {
  return data.map(d => {
    return (
      <circle
        cx={xScale(xVal(d))}
        cy={yScale(yVal(d))}
        r='4'
        fill='steelblue'
      >
        <title>{timeFormat('%a')(xVal(d))}, {Math.round(yVal(d) * 100 / 100)}</title>
      </circle>
    )
  })
}

const Lines = ({data, xScale, yScale, xVal, yVal}) => (
  <path
    fill='none'
    stroke='steelblue'
    stroke-width='2'
    d={
      line()
        .x(d => xScale(xVal(d)))
        .y(d => yScale(yVal(d)))(data)
    }
  />
)

export const LineChart = () => {
  const [data, setData] = useState()

  useEffect(() => {
    // get data from the url and set state for the 1st time
    csv(url, d => {
      d['temperature'] = +d['temperature']
      d['timestamp'] = new Date(d['timestamp'])
      return d
    }).then(data => setData(data))
  }, [url])


  if(!data) return (<span>Loading...</span>)

  const yScale = scaleLinear()
    .domain(extent(data, yVal))
    .range([innerHeight, 0])
    .nice()

  const xScale = scaleTime()
    .domain(extent(data, xVal))
    .range([0, innerWidth])

  return (
    <>
      <h2>SF Week Temperature Data</h2>

      <svg width={width} height={height} style={{ background: '#eee' }}>
        <g transform={`translate(${margin['left']}, ${margin['top']})`}>

          <g className='axis bottom'>
            <AxisBottom xScale={xScale} innerHeight={innerHeight} />
            <text style={{fontSize: '2rem'}} textAnchor='middle' x={innerWidth / 2} y={innerHeight + 50}>{xLabel}</text>
          </g>

          <g className='axis left'>
            <AxisLeft yScale={yScale} label={yLabel} />
            <text style={{fontSize: '2rem'}} textAnchor='middle' transform={`translate(-50, ${innerHeight / 2}) rotate(-90)`}>{yLabel}</text>
          </g>

          <g className='lines'><Lines
            xScale={xScale}
            yScale={yScale}
            data={data}
            xVal={xVal}
            yVal={yVal}
          /></g>

          <g className='circle'><Circles
            xScale={xScale}
            yScale={yScale}
            data={data}
            xVal={xVal}
            yVal={yVal}
          /></g>
        </g>
      </svg>
    </>
  )
}