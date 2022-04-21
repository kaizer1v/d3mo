import { useState, useEffect } from 'react'

export const WindowMaker = () => {

  const [windowSize, setWindowSize] = useState(window.innerWidth)
  const handleResize = () => setWindowSize(window.innerWidth)

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    // you can write an listener remover by returning something from the useEffect
    return () => window.removeEventListener('resize', handleResize)
  }, [windowSize])

  return <div>{ windowSize }</div>
}