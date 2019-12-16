const mapAsync = fn => arr => {
  return arr.reduce(async (accumulatorPromise, currentValue, index) => {
    return accumulatorPromise.then(() => fn(currentValue, index));
  }, Promise.resolve());
};

module.exports = {
  mapAsync
};
