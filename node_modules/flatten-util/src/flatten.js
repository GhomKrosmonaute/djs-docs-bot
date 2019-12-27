let flattened = [];
module.exports = function flatten(value) {
    if (Array.isArray(value)) {
        value.map(flatten)
    } else {
        flattened.push(value)
    }
    return flattened
}