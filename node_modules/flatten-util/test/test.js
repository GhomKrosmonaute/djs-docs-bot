var flatten = require('../');
var assert = require('chai').assert;

describe('flatten', function() {
    it('should flatten a nested array', function() {
        let flattened = flatten([[1,[[2,[[3,4,[5]],6],[7]],8],[9]],[[10,11,[12]],13]])

        assert.deepEqual(flattened, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
    })
});