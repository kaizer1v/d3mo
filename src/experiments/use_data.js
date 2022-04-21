import { csv } from 'd3'
import { useState, useEffect } from 'react'

export const useData = (csv_url) => {
  /**
   * Given a data `csv_url`, create a hook that only should update `setData`
   * when the `csv_url` changes or the data gets updated on that `csv_url`
   */

  const [data, setData] = useState(null)

  useEffect(() => {
    const row = d => {
      d['Population'] = +d['2020']
      return d
    }

    csv(csv_url, row).then(data => setData(data.slice(0, 10)))
  }, [])

  return data
}