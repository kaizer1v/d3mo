# Viewports in SVGs

Let us have a look at svgs and attributes that it accepts

```html
<svg id="svg-1">
  ...
</svg>
```

That is a simple svg element. You can add inline styling like so

```html
<svg id="svg-1" width="350" height="300px">
  ...
</svg>
```

You can add values for attributes with `width` as one of the following
- numeric value like `width=350`
- text value without unit like `width="350"`
- text value with unit like `width="350px"`

All the three will produce the same result.