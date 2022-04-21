import React from 'react';
import { range } from 'd3';
import { Eye } from './components/eye';
import { Face } from './components/face';
import { Mouth } from './components/mouth';

const width = 960,
      height = 500,
      stroke_width = 10,
      cx = width / 2,
      cy = height / 2,
      eye_offset_x = 90,
      eye_offset_y = 100
      // eye_radius = 40

const Thopda = ({ children, width, height, cx, cy }) => (
  <svg width={width} height={height}>
    <g transform={`translate(${cx}, ${cy})`}>
      { children }
    </g>
  </svg>
)

const array = range(5)

export const Simley = () => array.map(() => {
  const eye_radius = Math.random() * 50

  return (
    <Thopda
      width={width}
      height={height}
      cy={cy}
      cx={cx}
    >
      <Face stroke_width={stroke_width} cy={cy} />

      <Eye radius={eye_radius} offset_x={-eye_offset_x} offset_y={-eye_offset_y} />
      <Eye radius={eye_radius} offset_x={eye_offset_x} offset_y={-eye_offset_y} />

      <Mouth stroke_width={stroke_width} />
    </Thopda>
  )
})