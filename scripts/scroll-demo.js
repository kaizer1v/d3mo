// import scrollama from 'scrollama'
import scrollama from './grok-scrollama.js'

// instantiate the scrollama
const scroller = scrollama()
const scroller2 = scrollama()
const scrolly = document.querySelector('#scrolly')
const article = scrolly.querySelector('article')
const step = article.querySelectorAll('.step')

const intro_steps = document.querySelectorAll('.intro-step')
// const figure = scrolly.querySelector('figure')
const svg = scrolly.querySelector('svg')
const pathlength = mypath.getTotalLength()

/**
 * svg path scrolling function
 */
function handlePathScroll(response) {

  // get the scroll posiition at this step and make that starting point of path
  const length = (window.scrollY * pathlength) / document.body.scrollHeight * 1.5

  // Current position
  const pt = mypath.getPointAtLength(length)

  // A small offset ahead to find direction
  const delta = 0.5 // smaller = smoother rotation
  const nextPt = mypath.getPointAtLength(length + delta)

  // Calculate angle from current point to next point
  const angle = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI)

  // Move and rotate rectangle around its center
  myrect.setAttribute(
    "transform",
    `translate(${pt.x - 10}, ${pt.y - 25}) rotate(${angle}, 10, 25)`
  )

}

// scrollama event handlers
function handleStepEnter(response) {
  // response = { element, direction, index }
  console.log(response)
  // debugger
  // handlePathScroll()
  // add to color to current step
  response.element.classList.add('is-active')
}

function handleStepExit(response) {
  // response = { element, direction, index }
  console.log(response)
  // remove color from current step
  response.element.classList.remove('is-active')
}

function handleResize() {
  // 1. update height of step elements
  const stepH = Math.floor(window.innerHeight * 0.75)
  step.forEach(d => d.style.height = `${stepH}px`)

  const figureHeight = window.innerHeight / 1.5
  const figureMarginTop = (window.innerHeight - figureHeight) / 1.5

  svg.style.height = `${figureHeight}px`
  svg.style.top = `${figureMarginTop}px`

  // 3. tell scrollama to update new element dimensions
  scroller.resize()
  scroller2.resize()
}

function init() {
  // set random padding for different step heights (not required)
  step.forEach((step) => {
    step.style.padding = `${100 + Math.floor((Math.random() * window.innerHeight) / 6)}px 0px`
  })

  intro_steps.forEach((step) => {
    step.style.padding = `${100 + Math.floor((Math.random() * window.innerHeight) / 6)}px 0px`
  })

  // 1. setup the scroller with the bare-bones options
  // 		this will also initialize trigger observations
  // 2. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: '#scrolly article .step',
      // debug: true,
      progress: true,
      // offset: 0.3
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit)
    .onStepProgress(handlePathScroll)

    scroller2
      .setup({
        step: '#intro article .step',
        // debug: true,
        progress: true,
        // offset: 0.3
      })
      .onStepEnter(handleStepEnter)
      .onStepExit(handleStepExit)
      // .onStepProgress(handlePathScroll)


    handleResize()

}

export { init }
