# d3

This repo is a playgroud of my experiments with d3.

But, before that there are some basics of svg that one needs to understand

## SVG

### Basics

SVG stands for scalable vector graphics. This is an html tag itself and can be declared in an html file
with some default attributes like

```html
<svg width="300px" height="450px"></svg>
```

Think of the svg area in your html as a co-ordinate system, just like the co-ordinate system in mathematics.
The only difference is that the co-ordinate system in the svg starts from the top-left corner i.e. `(0, 0)`;
As you move down vertically, the `y` co-ordinate value keeps increasing and as you move from left towards the right,
the `x` co-ordinate value keeps increasing.

### Shapes

SVG provides basic shapes that can be used as a tag with respective attributes. This helps you create
from simple shapes like rectangle, circles, lines to complex shapes like bezier curves, sine waves and
lot of other [cool stuff](https://d3js.org/).

Let us look the different kinds of shapes and their attributes.

#### Rect

```html
<svg>
  <rect x="25" y="50" width="50" height="40"></rect>
</svg>
```

We just created a rectangle with 50px as width and 40px as it's height. This rectangle will be drawn at `(25, 50)`
in the svg. This point on the rectangle will be it's top-left corner.

You can also have some additional styling attributes like `fill` for a colour and a `stroke` for a border.
For example,

```html
<svg>
  <rect
    x="25"
    y="50"
    width="50"
    height="40"
    fill="red"
    stroke="blue"
    stroke-width="3"
  ></rect>
</svg>
```

Here the `stroke` attribute actually takes a colour value which can be either

- a valid colour text
- hex value
- rgb or an rgba value

#### Circle

```html
<svg>
  <circle
    cx="100"
    cy="100"
    r="30"
    fill="none"
    stroke="red"
  ></circle>
</svg>
```

Here just like in the rect, you can provide an x and y co-ordinate values. But instead in a circle, it is
called as `cx` and `cy`. Also, the x and y values point to the center of the circle. Thus, a circle with
`cx="0"` and `cy="0"` attributes will start its center from the top-left of the svg.

The `r` as you can imagine stands for the radius.

**NOTE: You can have a special `none` value for the fill which will make the element transparent. **

#### Line

A line, just like in mathematical co-ordinate system, takes 2 points as arguments

```html
<svg>
  <line
    x1="130"
    y1="180"
    x2="225"
    y2="260"
    stroke-width="10"
  ></line>
</svg>
```

The line does not have a `fill` attribute since it is just a stroke itslef.

### References

- [Curran Kelleher's d3 presentation](https://youtu.be/8jvoTV54nXw)
- [SVG Documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/SVG)