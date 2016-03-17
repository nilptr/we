
function Layer(type, fn) {
  if (!(this instanceof Layer))
    return new Layer(type, fn);

  this.type = type;
  this.fn = fn;
}

Layer.prototype.match = function (msgType) {
  return this.type === '*' || this.type === msgType;
};

Layer.prototype.handleRequest = function (ctx, next) {
  var fn = this.fn;

  try {
    if (fn.length > 2) {
      fn(null, ctx, next);
    } else {
      fn(ctx, next);
    }
  } catch (e) {
    next(e);
  }
};

Layer.prototype.handleError = function (err, ctx, next) {
  var fn = this.fn;
  if (fn.length > 2) {
    try {
      fn(err, ctx, next);
    } catch (e) {
      next(e);
    }
  } else {
    next(err);
  }
};

module.exports = Layer;