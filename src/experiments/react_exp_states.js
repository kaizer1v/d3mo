import { useState } from 'react'


export function States() {

  const [count, updateCount] = useState(0)
  const minus = () => updateCount(prevCount => prevCount - 1)
  const plus  = () => updateCount(prevCount => prevCount + 1)

  return (
    <>
      <button onClick={minus}>-</button>
      <span>{count}</span>
      <button onClick={plus}>+</button>
    </>
  )
}