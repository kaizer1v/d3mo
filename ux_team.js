// create an svg element
const svg = d3.select('#playground')
  .attr('width', '90vw')
  .attr('height', '90vh')

const svg_width = svg.node().clientWidth
const svg_height = svg.node().clientHeight
const centerX = svg_width / 2
const centerY = svg_height / 2
const radius = 30

/**
 * given a set of grouped data, generate centers coordinates for each group
 * in the canvas that is spaced out
 * 
 * @param {Array} data - the data set
 * @param {String} key - the key to group by
 */
function generate_centers(data, key) {
  const centers = []
  const groups = data.reduce((acc, d) => {
    // if nested structure, then split and reduce
    const keyValue = key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : null, d)
    // if keyValue is an array, then split it and add to the array
    if(Array.isArray(keyValue)) {
      keyValue.forEach(k => {
        if(!acc[k]) acc[k] = []
        acc[k].push(d)
      })
    } else {
      if(!acc[keyValue]) acc[keyValue] = []
      acc[keyValue].push(d)
    }
    return acc
  }, {})

  const keys = Object.keys(groups)
  const angle = 2 * Math.PI / keys.length

  // for each key, calculate the x, y coordinates
  keys.forEach((k, i) => {
    centers.push({
      name: k,
      x: 200 * Math.cos(angle * i),
      y: 200 * Math.sin(angle * i)
    })
  })

  return centers
}

// data
const nodes = d3.json('data/ux_team.json')
  .then(data => data.data)
  .then(data => load_force(data))
  .catch(err => console.error(err))


/**
 * given a string, convert it to camel case
 * 
 * @param {String} str - the string to convert to camel case
 */
function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/^\w/, char => char.toUpperCase())
}

function repos_default(nodes, simulation, pos = []) {
  simulation.force('x', null)
  simulation.force('y', null)

  simulation.on('tick', () => {
    node
      .attr('cx', d => centerX + d.x) // default position to center of the svg
      .attr('cy', d => centerY + d.y) // default position to center of the svg
  })
  return
}

/**
 * given a set of nodes, create a force layout
 * 
 * @param {Array} nodes - the data set 
 */
function load_force(nodes) {

  const interests_centres = generate_centers(nodes, 'hobbies.all')
  const hub_centres = generate_centers(nodes, 'hub')
  const location_centres = generate_centers(nodes, 'from.state')
  const bday_centres = generate_centers(nodes, 'bday.month')
  
  // background image to circles
  const defs = svg.append('svg:defs')

  defs.append('svg:pattern')
    .selectAll('pattern')
    .data(nodes)
    .enter()
    .append('svg:pattern')
    .attr('id', (d) => d.name.toLowerCase() + '_avatar')
    .attr('width', 1)
    .attr('height', 1)
    .append('svg:image')
    .attr('xlink:href', (d => `data/photos/${d.name.toLowerCase()}.jpg`))
    .attr('width', radius * 2)
    .attr('height', radius * 2)
    .attr('x', 0)
    .attr('y', 0)


  // add each circle for a data point
  const node = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', radius)
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .style('fill', (d) => `url(#${d.name.toLowerCase()}_avatar)`)


  // simulate a force and describe how it should behave
  const simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(0))
    .force('collide', d3.forceCollide(radius + 1))    // avoid overlapping (21 = radius + 1)
  
  // run the simulation for every 'tick'
  // this is for every frame of the simulation, you need to position the circle
  simulation.on('tick', () => {
    node
      .attr('cx', d => centerX + d.x) // default position to center of the svg
      .attr('cy', d => centerY + d.y) // default position to center of the svg
  })


  /**
   * given a data key and a set of coordinates, reposition the nodes to 
   * the provided positions
   * 
   * @param {String} key - the key to group by
   * @param {Object} pos - the centers to group by
   */
  function reposition(key, pos) {
    svg.style('background-image', 'none')

    simulation.force('x', null)
    simulation.force('y', null)

    nodes.forEach(d => {
      d.x = centerX
      d.y = centerY
    })

    if(pos.length === 0) {
      simulation.on('tick', () => {
        node
          .attr('cx', d => d.x) // default position to center of the svg
          .attr('cy', d => d.y) // default position to center of the svg
      })
    }
    simulation.alpha(1).restart()
    
    simulation.force('x', d3.forceX(d => {
      // get the key for which you want to determine the center for
      const values = key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : null, d)
      let center
      // check if values is an array, if so, then check if key exists in the array
      if(Array.isArray(values)) {
        center = pos.find(c => values.includes(c.name))
      } else {
        center = pos.find(c => c.name === values)
      }

      if(!center) return centerX
      return center['x']
    }).strength(0.1))

    simulation.force('y', d3.forceY(d => {
      const values = key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : null, d)
      let center
      if(Array.isArray(values)) {
        center = pos.find(c => values.includes(c.name))
      } else {
        center = pos.find(c => c.name === values)
      }
      if(!center) return centerY
      return center['y']
    }).strength(0.1))

    // show tooltip on hover of the svg circle & remove on mouseout
    node.on('mouseover', (event, d) => showTooltip(this, d, key))
    node.on('mouseout', (event, d) => hideTooltip(this, d, key))

    simulation.alpha(1).restart()
  }

  // group by hub
  const everyone = document.getElementById('by-everyone')
  const by_hub = document.getElementById('by-hub')
  const by_location = document.getElementById('by-from')
  const by_bday = document.getElementById('by-bday')
  const by_joining_date = document.getElementById('by-joining-date')
  const by_interests = document.getElementById('by-interests')
  const by_alumni = document.getElementById('by-alumni')
  
  // reset force layout
  everyone.addEventListener('click', () => {
    svg.style('background-image', 'none')
    svg.selectAll('.x-axis').remove()
    reposition('name', [])
  })

  // group by hub
  by_hub.addEventListener('click', () => {
    svg.style('background-image', 'none')
    svg.selectAll('.x-axis').remove()
    reposition('hub', hub_centres)
  })

  // group by location
  by_location.addEventListener('click', () => {
    svg.style('background-image', 'url(data/india.webp)')
    svg.style('background-repeat', 'no-repeat')
    svg.selectAll('.x-axis').remove()
    reposition('from.state', location_centres)
  })

  // by birthdate
  by_bday.addEventListener('click', () => {
    svg.style('background-image', 'url(data/months.webp)')
    svg.selectAll('.x-axis').remove()
    reposition('bday.month', bday_centres)
  })

  // by alumni
  by_alumni.addEventListener('click', () => {
    svg.style('background-image', 'none')
    svg.selectAll('.x-axis').remove()
    // filter nodes where `quit = true`
    // const alumni = nodes.filter(d => d.quit)
  })

  by_interests.addEventListener('click', () => {
    svg.style('background-image', 'none')
    svg.selectAll('.x-axis').remove()
    reposition('hobbies.all', interests_centres)
  })

  by_joining_date.addEventListener('click', () => {
    svg.style('background-image', 'none')
    // console.log(nodes)
    let scale_x = d3.scaleLinear()
      .domain([1999, new Date().getFullYear()])
      .range([centerX - svg_width / 2, centerX + svg_width / 2])
      .clamp(true)

      svg.selectAll('.x-axis').remove()

    // show the scale as x-axis
    const gx = svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${svg_height - 100})`)
      .call(d3.axisBottom(scale_x))
  
    const coords = nodes.map(d => {
      return {
        name: d.name,
        joined: d.joined,
        x: scale_x(d.joined),
        y: centerY
      }
    })

    simulation.stop()

    // position the circles based on the joining date without using the force layout
    nodes.forEach(d => {
      d.x = scale_x(d.joined)
      d.y = centerY
    })

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .on('mouseover', (event, d) => showTooltip(this, d, 'joined'))

    simulation.restart()
  })

  function showTooltip(e, d, key) {
    const tooltipValue = '' + key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : null, d)
    console.log('key', key, 'value', tooltipValue)

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '1px solid black')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('opacity', 0.9)
      .style('left', e.pageX + 10 + 'px')
      .style('top', e.pageY + 10 + 'px')
      .text(toCamelCase(tooltipValue))
  }

  function hideTooltip() {
    d3.select('.tooltip').remove()
  }

}
