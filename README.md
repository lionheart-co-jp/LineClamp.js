# LineClamp

Ellipses multiple line texts.

[Demo is here](https://lionheart-co-jp.github.io/LineClamp.js/)

## How to use

```js
new LineClamp('.foo', {lines: 3});
```

### Support Responsive

```js
new LineClamp('.foo', {
    lines: 3,
    breakpoints: {
        750: {
            lines: 5,
        }
    }
});
```

### Disable

```js
var lc = new LineClamp('.foo', {lines: 3});
lc.disable();
```


## Options


| Parameter   | Type   | default | Description                                                          |
|-------------|--------|---------|----------------------------------------------------------------------|
| lines       | number | 1       | Ellipses rows number                                                 |
| ellipses    | string | ...     | Ellipses character                                                   |
| language    | string | en      | en (ellipses by space) or ja (ellipses by character)                 |
| breakpoints | array  | {}      | {[key: number]: {lines: number, ellipses: string, language: string}} |


## Methods

| Methods name             | Description                |
|--------------------------|----------------------------|
| LineClamp.enable()       | Enable LineClamp function  |
| LineClamp.disable()      | Disable LineClamp function |