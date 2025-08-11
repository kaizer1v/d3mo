import scrollama from 'scrollama'

// instantiate the scrollama
const scroller = scrollama()
const scrolly = document.querySelector('#scrolly')
const article = scrolly.querySelector('article')
const step = article.querySelectorAll('.step')
const figure = scrolly.querySelector('figure')

// initialize the scrollama
// var scroller = scrollama()

// scrollama event handlers
function handleStepEnter(response) {
  // response = { element, direction, index }
  console.log(response)
  // add to color to current step
  response.element.classList.add('is-active')

  figure.querySelector('p').innerText = `${response.index + 1}`
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
  // step.style('height', stepH + 'px')
  // debugger
  step.forEach(d => d.style.height = stepH + 'px')

  const figureHeight = window.innerHeight / 2
  const figureMarginTop = (window.innerHeight - figureHeight) / 2

  figure.style.height = figureHeight + 'px'
  figure.style.top = figureMarginTop + 'px'

  // 3. tell scrollama to update new element dimensions
  scroller.resize();
}

function init() {

  handleResize()

  // set random padding for different step heights (not required)
  step.forEach((step) => {
    step.style.padding = `${100 + Math.floor((Math.random() * window.innerHeight) / 4)}px 0px`
  })

  // 1. setup the scroller with the bare-bones options
  // 		this will also initialize trigger observations
  // 2. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: '#scrolly article .step',
      debug: false,
      offset: 0.3
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit)

}

// kick things off
// init()
export { init }
