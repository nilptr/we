
function Layer(type, fn) {
  if (!(this instanceof Layer))
    return new Layer(type, fn);

  this.type = type;
  this.fn = fn;
}

Layer.prototype.match = function (msgType) {
  return this.type === '*' || this.type === msgType;
};

Layer.prototype.handleRequest = function (msg, req, res, next) {
  var fn = this.fn;

  try {
    if (fn.length > 4) {
      fn(null, msg, req, res, next);
    } else {
      fn(msg, req, res, next);
    }
  } catch (e) {
    next(e);
  }
};

Layer.prototype.handleError = function (err, msg, req, res, next) {
  var fn = this.fn;
  if (fn.length > 4) {
    try {
      fn(err, msg, req, res, next);
    } catch (e) {
      next(e);
    }
  } else {
    next(err);
  }
};

module.exports = Layer;