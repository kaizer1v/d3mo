import { csv, scaleBand, scaleLinear, max } from 'd3'
import { useState, useEffect } from 'react'
import './css/App.css'

const url = 'https://gist.githubusercontent.com/curran/0ac4077c7fc6390f5dd33bf5c06cb5ff/raw/605c54080c7a93a417a3cea93fd52e7550e76500/UN_Population_2019.csv',
      width = window.innerWidth,
      height = window.innerHeight

const App = () => {

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
    .range([0, height])

  const wScale = scaleLinear()
    .domain([0, max(data, d => d['Population'])])
    .range([0, width])

  return (
    <svg width={width} height={height}>
      {
        data.map(d => (
          <rect x="0" y={yScale(d['Country'])} width={wScale(d['Population'])} height={yScale.bandwidth()}></rect>
        ))
      }
    </svg>
  )
}

export default App