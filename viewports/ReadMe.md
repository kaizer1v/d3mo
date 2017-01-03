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

Now, let us assume you have the following html with an svg and a rect inside it.

```html
<!doctype html>
<html>
<head>
  <title>Viewports in SVG</title>
  <style type="text/css">
    /* Minimal styling to svg */
    svg {
      background: #aeb7c6;
      border: 1px solid #000; /* borders are on the outside - takes extra space other than width and height. */
    }
  </style>
<body>
  <svg id="svg-1" width=160 height="120px">
    <rect x="14" y="24" width="50px" height="50px" fill="#f00"></rect>
  </svg>
</body>
</head>
</html>
```

The html will look something like this.
![image-1](readme_ref/image-1.png)

