import { csv, scaleBand, scaleLinear, max, format } from 'd3'
import { useState, useEffect, useCallback } from 'react'
import '../css/bar_chart_simple.css'

const url = 'https://gist.githubusercontent.com/curran/0ac4077c7fc6390f5dd33bf5c06cb5ff/raw/605c54080c7a93a417a3cea93fd52e7550e76500/UN_Population_2019.csv',
      width = window.innerWidth,
      height = window.innerHeight,
      margin = { 'top': 20, 'right': 20, 'bottom': 50, 'left': 200 },
      innerWidth = width - (margin['left'] + margin['right']),
      innerHeight = height - (margin['top'] + margin['bottom']),
      xVal = d => d['Population'],
      yVal = d => d['Country']


const useData = (csv_url, sel_year) => {

}

const AxisBottom = ({xScale, innerHeight, tickFormat}) => {
  return xScale.ticks().map(tickVal => (
    <g key={tickVal} transform={`translate(${xScale(tickVal)}, 0)`}>
      <line y2={innerHeight} stroke='black' />
      <text style={{ textAnchor: 'middle' }} y={innerHeight + 5} dy='0.71em'>{tickFormat(tickVal)}</text>
    </g>
  ))
}

const AxisLeft = ({yScale}) => {
  return yScale.domain().map(tickVal => (
    <text
      key={tickVal}
      style={{ textAnchor: 'end' }}
      x='-10'
      y={yScale(tickVal) + yScale.bandwidth() / 2}
      dy='0.32em'
    >{tickVal}</text>
  ))
}

const Bars = ({data, xScale, yScale, xVal, yVal}) => {
  return data.map(d => (
    <rect
      key={yVal(d)}
      x='0'
      y={yScale(yVal(d))}
      width={xScale(xVal(d))}
      height={yScale.bandwidth()}
    >
      <title>{format(',.2r')(xVal(d))}</title>
    </rect>
  ))
}

const Dropdown = ({data}) => {
  const year = Object.keys(data[0]).slice(0, 71)

  const handleDropdown = (e) => {
    console.log(e.target.value)
    // useData(url)
  }

  return (
    <select onChange={handleDropdown}>
      { year.map(y => <option key={y} value={y}>{y}</option>) }
    </select>
  )
}

export const SimpleBarChart = () => {
  // const data = useData(url, '2020')
  const [data, setData] = useState(null)

  const sel_year = '2020'

  useEffect(() => {
    const row = d => {
      d['Population'] = +d[sel_year] * 1000
      return d
    }
    csv(url, row).then(data => setData(data.slice(0, 10)))
  }, [url, sel_year])

  if(!data) return (<span>Loading...</span>)

  const yScale = scaleBand()
    .domain(data.map(d => d['Country']))
    .range([0, innerHeight])
    .padding(0.1)

  const xScale = scaleLinear()
    .domain([0, max(data, d => d['Population'])])
    .range([0, innerWidth])

  return (
    <>
      <h2>Top 10 Populated Counties</h2>
      <Dropdown data={data} />
      <svg width={width} height={height} style={{ background: '#eee' }}>
        <g transform={`translate(${margin['left']}, ${margin['top']})`}>

          <g className='axis bottom'><AxisBottom
            xScale={xScale}
            innerHeight={innerHeight}
            tickFormat={n => format('.2s')(n).replace('G', 'B')}
          /></g>

          <g className='axis left'><AxisLeft yScale={yScale} /></g>

          <g className='bars'><Bars
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