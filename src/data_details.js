import { useState, useEffect } from 'react'
import { csv, csvFormat } from 'd3'

const url = 'https://gist.githubusercontent.com/curran/b236990081a24761f7000567094914e0/raw/acd2b8cecfe51c520622fbaf407ee88b8796bfc6/cssNamedColors.csv'

const msg = (data) => (
  <div>
    <h4>File size: { Math.round(csvFormat(data).length / 1024) } kB</h4>
    <h4>{data.length} rows</h4>
    <h4>{data.columns.length} columns</h4>
  </div>
)

const App = () => {
  const [data, setData] = useState(null)

  // useEffect runs the content inside the function only once
  useEffect(() => {
    csv(url).then(setData)
  }, [])

  return (
    <>
      <h1>Fething and loading data with D3 & React</h1>
      { (data) ? msg(data) : 'Data is loading...' }
    </>
  )
}

export default App;