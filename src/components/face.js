export const Face = ({ cy, stroke_width }) => (
  <circle
    r={cy - stroke_width / 2}
    fill='yellow'
    stroke='black'
    strokeWidth={stroke_width}
  />
)