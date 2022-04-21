import { arc } from 'd3';

const smile = arc()
  .innerRadius(0)
  .outerRadius(100)
  .startAngle(0)
  .endAngle(Math.PI)

export const Mouth = ({ stroke_width }) => (
  <g transform='rotate(90)'>
    <path d={smile()} fill='none' stroke='black' strokeWidth={stroke_width} />
  </g>
)