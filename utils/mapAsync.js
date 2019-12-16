Array.prototype.mapAsync = function(fn) {
  return this.reduce(async (accumulatorPromise, currentValue, index) => {
    return accumulatorPromise.then(() => fn(currentValue, index));
  }, Promise.resolve());
}

module.exports = Array