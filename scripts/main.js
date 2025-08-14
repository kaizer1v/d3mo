import { init } from './scroll-demo.js'
// import { init } from './scroll-demo2.js'

init()

// const pathlength = mypath.getTotalLength()

// window.onscroll = () => {
//   // Progress along path (scale factor can be adjusted)
//   const length = (window.scrollY * pathlength) / document.body.scrollHeight * 1.5

//   // Current position
//   const pt = mypath.getPointAtLength(length)

//   // A small offset ahead to find direction
//   const delta = 0.5 // smaller = smoother rotation
//   const nextPt = mypath.getPointAtLength(length + delta)

//   // Calculate angle from current point to next point
//   const angle = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI)

//   // Move and rotate rectangle around its center
//   myrect.setAttribute(
//     "transform",
//     `translate(${pt.x - 10}, ${pt.y - 25}) rotate(${angle}, 10, 25)`
//   )
// }