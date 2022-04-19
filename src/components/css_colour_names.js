import { csv, arc, pie } from 'd3'
import { useState, useEffect } from 'react'
import './css/App.css'

const url = 'https://gist.githubusercontent.com/curran/b236990081a24761f7000567094914e0/raw/cssNamedColors.csv',
      width = window.innerWidth,
      height = window.innerHeight,
      midX = width / 2,
      midY = height / 2

/** To run this function, rename this to App & rename App to something else **/
const Boxes = () => {

  const [data, setData] = useState(null)

  useEffect(() => {
    csv(url).then(setData)
  }, [])


  if(!data) return (<span>Loading...</span>)
  return data.map(d => <div className='colourBox' style={{ background: d['RGB hex value'] }}>{ d['Keyword'] }</div>)
}



const pieArc = arc()
  .innerRadius(0)
  .outerRadius(width)

export const ColourNames = () => {

  const [data, setData] = useState(null)

  useEffect(() => {
    csv(url).then(setData)
  }, [])

  if(!data) return (<span>Loading...</span>)
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${midX}, ${midY})`}>
        {
          pie().value(1)(data).map((d, i) => (
            <path fill={ d.data['RGB hex value'] } d={ pieArc(d) }></path>
          ))
        }
      </g>
    </svg>
  )
}