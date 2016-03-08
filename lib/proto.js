var url = require('url');
var util = require('util');

var getRawBody = require('raw-body');

var Layer = require('./layer');
var reply = require('./message/reply');
var WXBizMsgCrypt = require('./wxCrypt');
var parseMsg = require('./message/parseMsg');

function Proto(opt) {
  var token = opt.token;
  var encodingAesKey = opt.encodingAesKey;
  var appId = opt.appId;

  function wechat(req, res, next) {
    wechat.handle(req, res, next);
  }
  wechat.__proto__ = Proto.prototype;

  wechat.token = token;
  wechat.encodingAesKey = encodingAesKey;
  wechat.appId = appId;
  wechat.secure = !!opt.secure;

  wechat._msgCrypto = new WXBizMsgCrypt(token, encodingAesKey, appId);

  wechat._handlers = [];

  return wechat;
}

util.inherits(Proto, Function);

/**
 * 处理逻辑 (预处理: query, body, parseXml, res.reply)
 * @param req
 * @param res
 * @param next
 */
Proto.prototype.handle = function(req, res, next) {
  var self = this;
  var secure = this.secure;
  var msgCrypto = this._msgCrypto;

  // next
  next = next || function _next(err) {
      console.error(err.stack);
      res.statusCode = err.status || 500;
      res.end(err.message || 'some error happened');
    };

  // query
  req.query = req.query || url.parse(req.url, true).query;
  var query = req.query;

  // res extend
  req.res = res;
  res.req = req;
  res.reply = reply;

  // body
  getBody(req, function (err, buf) {
    if (err) return next(err);

    var xml = buf.toString('utf8');
    var msg = null;

    if (secure) {
      msg = parseMsg(xml);
      try {
        xml = msgCrypto.decryptMsg(
          query['msg_signature'],
          query['timestamp'],
          query['nonce'],
          msg.encrypt
        );
        msg = req.msg = parseMsg(xml);
        self.process(msg, req, res, next);
      } catch (e) {
        next(e);
      }
    } else {
      msg = req.msg = parseMsg(xml);
      self.process(msg, req, res, next);
    }
  });
};

Proto.prototype.process = function (msg, req, res, done) {
  var handlers = this._handlers;
  var idx = 0;
  var len = handlers.length;

  function next(err) {
    if (idx === len) return done(err);
    var layer = handlers[idx++];
    if (layer.match(msg.msgType)) {
      if (err)
        layer.handleError(err, msg, req, res, next);
      else
        layer.handleRequest(msg, req, res, next);
    } else {
      next(err);
    }
  }

  next(null);
};

Proto.prototype.use = function (fn) {
  this._handlers.push(new Layer('*', fn));
};

[
  'text',
  'image',
  'voice',
  'video',
  'shortvideo',
  'location',
  'link',
  'event'
].forEach(function (type) {
  Proto.prototype[type] = function(fn) {
    this._handlers.push(new Layer(type, fn));
  };
});

function getBody(req, callback) {
  if (req.rawBody) {
    process.nextTick(function () {
      callback(null, req.rawBody);
    });
  } else {
    getRawBody(req, function (err, buf) {
      callback(err, req.rawBody = buf);
    });
  }
}