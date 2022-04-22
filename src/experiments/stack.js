import { stack, stackOrderNone, stackOffsetNone } from 'd3'

const width = window.innerWidth,
      height = window.innerHeight,
      margin = { 'top': 20, 'right': 20, 'bottom': 50, 'left': 200 },
      innerWidth = width - (margin['left'] + margin['right']),
      innerHeight = height - (margin['top'] + margin['bottom']),
      data = [
        {month: new Date(2015, 0, 1), apples: 3840, bananas: 1920, cherries: 960, dates: 400},
        {month: new Date(2015, 1, 1), apples: 1600, bananas: 1440, cherries: 960, dates: 400},
        {month: new Date(2015, 2, 1), apples:  640, bananas:  960, cherries: 640, dates: 400},
        {month: new Date(2015, 3, 1), apples:  320, bananas:  480, cherries: 640, dates: 400}
      ],
      stck = stack()
        .keys(['apples', 'bananas', 'cherries', 'dates'])
        .order(stackOrderNone)
        .offset(stackOffsetNone)

console.log(stck(data))

export const Stacks = () => {

  return (
    <svg width={width} height={height} style={{ background: '#eee' }}>
    </svg>
  )
}