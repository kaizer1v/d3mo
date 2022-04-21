import { csv, scaleLinear, extent, format } from 'd3'
import { useState, useEffect } from 'react'

const url = 'https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/0e7a9b0a5d22642a06d3d5b9bcbad9890c8ee534/iris.csv',
      width = window.innerWidth,
      height = window.innerHeight,
      margin = { 'top': 20, 'right': 20, 'bottom': 100, 'left': 200 },
      innerWidth = width - (margin['left'] + margin['right']),
      innerHeight = height - (margin['top'] + margin['bottom']),
      xVal = d => d['sepal_width'],
      yVal = d => d['petal_length']

const AxisBottom = ({xScale, innerHeight}) => {
  return xScale.ticks().map(tickVal => (
    <g key={tickVal} transform={`translate(${xScale(tickVal)}, 0)`}>
      <line y2={innerHeight} stroke='black' />
      <text style={{ textAnchor: 'middle' }} y={innerHeight + 5} dy='0.71em'>{tickVal}</text>
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
  return data.map(d => (
    <circle
      cx={xScale(xVal(d))}
      cy={yScale(yVal(d))}
      r='10'
      fill='tomato'
    >
      <title>{xVal(d)},{yVal(d)}</title>
    </circle>
  ))
}

export const ScatterPlot = () => {
  const [data, setData] = useState()

  useEffect(() => {
    const row = d => {
      d['sepal_width'] = +d['sepal_width']
      d['petal_length'] = +d['petal_length']
      return d
    }
    csv(url, row).then(data => setData(data))
  }, [url])


  if(!data) return (<span>Loading...</span>)

  const yScale = scaleLinear()
    .domain(extent(data, xVal))
    .range([0, innerHeight])
    .nice()

  const xScale = scaleLinear()
    .domain(extent(data, yVal))
    .range([0, innerWidth])

  return (
    <>
      <h2>Iris Dataset</h2>

      <svg width={width} height={height} style={{ background: '#eee' }}>
        <g transform={`translate(${margin['left']}, ${margin['top']})`}>

          <g className='axis bottom'><AxisBottom
            xScale={xScale}
            innerHeight={innerHeight}
          /></g>

          <g className='axis left'><AxisLeft yScale={yScale} /></g>

          <g className='circles'><Circles
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