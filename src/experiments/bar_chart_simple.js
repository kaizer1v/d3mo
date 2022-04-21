import { csv, scaleBand, scaleLinear, max } from 'd3'
import { useState, useEffect } from 'react'
import '../css/bar_chart_simple.css'

const url = 'https://gist.githubusercontent.com/curran/0ac4077c7fc6390f5dd33bf5c06cb5ff/raw/605c54080c7a93a417a3cea93fd52e7550e76500/UN_Population_2019.csv',
      width = window.innerWidth,
      height = window.innerHeight,
      margin = { 'top': 20, 'right': 20, 'bottom': 50, 'left': 200 },
      innerWidth = width - (margin['left'] + margin['right']),
      innerHeight = height - (margin['top'] + margin['bottom'])

export const SimpleBarChart = () => {

  const [data, setData] = useState(null)

  useEffect(() => {
    const row = d => {
      d['Population'] = +d['2020']
      return d
    }

    csv(url, row).then(data => setData(data.slice(0, 10)))
  }, [])


  if(!data) return (<span>Loading...</span>)

  const yScale = scaleBand()
    .domain(data.map(d => d['Country']))
    .range([0, innerHeight])

  const wScale = scaleLinear()
    .domain([0, max(data, d => d['Population'])])
    .range([0, innerWidth])

  return (
    <svg width={width} height={height} style={{ background: '#eee' }}>

      <g transform={`translate(${margin['left']}, ${margin['top']})`}>
        { /* X Scale Axes */
          wScale.ticks().map(tickVal => (
            <g key={tickVal} transform={`translate(${wScale(tickVal)}, 0)`}>
              <line y2={innerHeight} stroke='black' />
              <text style={{ textAnchor: 'middle' }} y={innerHeight + 5} dy='0.71em'>{tickVal}</text>
            </g>
          ))
        }

        { /* Y Scale Axes */
          yScale.domain().map(tickVal => (
            <text
              key={tickVal}
              style={{ textAnchor: 'end' }}
              x='-10'
              y={yScale(tickVal) + yScale.bandwidth() / 2}
              dy='0.32em'
            >{tickVal}</text>
          ))
        }

        { /* Bars */
          data.map(d => (
            <rect
              key={d['Country']}
              x='0'
              y={yScale(d['Country'])}
              width={wScale(d['Population'])}
              height={yScale.bandwidth()}
            />
          ))
        }
      </g>
    </svg>
  )
}