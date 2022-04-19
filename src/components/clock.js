// import React from 'react';
import * as d3 from 'd3';

function Clock(props) {

  const clockRadius = 300,
        margin = 50,
        w = (clockRadius + margin) * 2,
        h = (clockRadius + margin) * 2,
        hourHandLength = (2 * clockRadius) / 3,
        minuteHandLength = clockRadius - 20,
        secondHandLength = clockRadius - 12,
        secondHandBalance = 30,
        secondTickStart = clockRadius,
        secondTickLength = -10,
        hourTickStart = clockRadius,
        hourTickLength = -18,
        secondLabelRadius = clockRadius + 16,
        secondLabelYOffset = 5,
        hourLabelRadius = clockRadius - 40,
        hourLabelYOffset = 7,
        radians = Math.PI / 180,
        svg = d3.select('#clock')

  const twelve = d3
    .scaleLinear()
    .range([0, 360])
    .domain([0, 12])

  const sixty = d3
    .scaleLinear()
    .range([0, 360])              // for a full circle
    .domain([0, 60])

  const handData = [
    {
      type: "hour",
      value: 0,
      length: -hourHandLength,
      scale: twelve
    },
    {
      type: "minute",
      value: 0,
      length: -minuteHandLength,
      scale: sixty
    },
    {
      type: "second",
      value: 0,
      length: -secondHandLength,
      scale: sixty,
      balance: secondHandBalance
    }
  ]

  function drawClock() {
    // create all the clock elements
    updateData() //draw them in the correct starting position
    const face = svg.select("#clock-face")
      .attr("transform", `translate(${[w / 2, h / 2]})`)

    // add marks for seconds
    face
      .selectAll(".second-tick")
      .data(d3.range(0, 60))
      .enter()
      .append("line")
      .attr("class", "second-tick")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", secondTickStart)
      .attr("y2", secondTickStart + secondTickLength)
      .attr("transform", d => `rotate(${sixty(d)})`)

    // and labels...
    face
      .selectAll(".second-label")
      .data(d3.range(5, 61, 5))
      .enter()
      .append("text")
      .attr("class", "second-label")
      .attr("text-anchor", "middle")
      .attr("x", d => secondLabelRadius * Math.sin(sixty(d) * radians))
      .attr("y", d => -secondLabelRadius * Math.cos(sixty(d) * radians) + secondLabelYOffset)
      .text(d => d)

    // ... and hours
    face
      .selectAll(".hour-tick")
      .data(d3.range(0, 12))
      .enter()
      .append("line")
      .attr("class", "hour-tick")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", hourTickStart)
      .attr("y2", hourTickStart + hourTickLength)
      .attr("transform", d => `rotate(${twelve(d)})`)

    face
      .selectAll(".hour-label")
      .data(d3.range(3, 13, 3))
      .enter()
      .append("text")
      .attr("class", "hour-label")
      .attr("text-anchor", "middle")
      .attr("x", d => hourLabelRadius * Math.sin(twelve(d) * radians))
      .attr(
        "y",
        d => -hourLabelRadius * Math.cos(twelve(d) * radians) + hourLabelYOffset
      )
      .text(d => d)

    const hands = face.append("g").attr("id", "clock-hands")

    hands
      .selectAll("line")
      .data(handData)
      .enter()
      .append("line")
      .attr("class", d => d.type + "-hand")
      .attr("x1", 0)
      .attr("y1", d => d.balance || 0)
      .attr("x2", 0)
      .attr("y2", d => d.length)
      .attr("transform", d => `rotate(${d.scale(d.value)})`)

    face
      .append("g")
      .attr("id", "face-overlay")
      .append("circle")
      .attr("class", "hands-cover")
      .attr("x", 0)
      .attr("y", 0)
      .attr("r", clockRadius / 20)
  }

  function moveHands() {
    d3.select("#clock-hands")
      .selectAll("line")
      .data(handData)
      .transition()
      .ease(d3.easeElastic.period(0.5))
      .attr("transform", d => `rotate(${d.scale(d.value)})`)
  }

  function updateData() {
    const t = new Date()
    handData[0].value = (t.getHours() % 12) + t.getMinutes() / 60
    handData[1].value = t.getMinutes()
    handData[2].value = t.getSeconds()
  }

  // const svg = d3
  //   .create("svg")
  //   .attr("viewBox", [0, 0, w, h])
  //   .style("max-width", "500px")
  //   .attr("id", "clock")

  drawClock()

  // Animation
  // const interval = setInterval(() => {
  //   updateData()
  //   moveHands()
  // }, 1000)
  // invalidation.then(() => clearInterval(interval))

  console.log(svg.node())

  // return the rendered html
  // return svg.node()
  return (
    <svg viewBox={`0, 0, ${w}, ${h}`} id="clock" style="max-width: 500px;">
      <g id="clock-face" transform="translate(350, 350)"></g>
    </svg>
  )
}

export default Clock;