import { useState, useCallback } from 'react'

const width = 960,
      height = 500,
      r = 30,
      posInit = {
        x: width / 2,
        y: height / 2
      }

const App = () => {
  const [pos, setPos] = useState(posInit)

  const mouseMoveHandler = useCallback(e => {
    const { clientX, clientY } = e        // deconstruct
    setPos({ x: clientX, y: clientY })
  }, [setPos])

  return (
    <>
      <h1>Mouse Follower</h1>
      <svg width={width} height={height} onMouseMove={mouseMoveHandler}>
        <circle cx={pos.x} cy={pos.y} r={r} />
      </svg>
    </>
  )
}

export default App