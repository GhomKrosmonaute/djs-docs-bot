# Flatten arrays
This library helps you to flatten nested arrays into a single level array.

## Installation
```bash
$ npm install flatten-util --save
```

## Usage
```javascript
import flatten from 'flatten-util'

let flattened = flatten([[1,[[2,[[3,4,[5]],6],[7]],8],[9]],[[10,11,[12]],13]])

console.log(flattened) // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
```

## Tests
To run the test suite, first install the dependencies, then run `npm test`:
```bash
$ npm install
$ npm test
```

## License
    [MIT](LICENSE)