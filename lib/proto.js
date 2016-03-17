var url = require('url');
var util = require('util');
var http = require('http');
var crypto = require('crypto');

var getRawBody = require('raw-body');

var Layer = require('./layer');
var Context = require('./context');
var WXBizMsgCrypt = require('./wxCrypt');
var parseMsg = require('./message/parseMsg');

function Proto(opt) {
  var token = opt.token;
  var encodingAESKey = opt.encodingAESKey;
  var appId = opt.appId;

  function wechat(req, res, next) {
    if (req.method.toLowerCase() === 'get')
      wechat.check(req, res, next);
    else
      wechat.handle(req, res, next);
  }
  wechat.__proto__ = Proto.prototype;

  wechat.token = token;
  wechat.encodingAESKey = encodingAESKey;
  wechat.appId = appId;
  wechat.secure = !!opt.secure;

  wechat._msgCrypto = new WXBizMsgCrypt(token, encodingAESKey, appId);

  wechat._handlers = [];

  return wechat;
}

util.inherits(Proto, Function);

Proto.prototype.check = function(req, res) {
  var query = url.parse(req.url, true).query;
  var sha1 = crypto.createHash('sha1');
  sha1.update([
    this.token,
    query.timestamp,
    query.nonce
  ].sort().join(''));
  var signature = sha1.digest('hex');

  if (signature === query.signature) {
    res.end(query.echostr);
  } else {
    res.end();
  }
};

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
      if (err) {
        console.error(err.stack);
        res.statusCode = err.status || 500;
        res.end(err.message || 'some error happened');
      } else {
        res.end();
      }
    };

  // parse query
  req.query = req.query || url.parse(req.url, true).query;
  var query = req.query;

  // get body
  getBody(req, function (err, buf) {
    if (err) return next(err);

    // parse message
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
        msg = parseMsg(xml);
      } catch (e) {
        next(e);
      }
    } else {
      msg = parseMsg(xml);
    }

    var ctx = new Context(msg, req, res, self);
    self.process(ctx, next);
  });
};

Proto.prototype.process = function (ctx, done) {
  var msgType = ctx.msg.msgType;

  var idx = 0;
  var handlers = this._handlers;
  var len = handlers.length;

  function next(err) {
    if (idx === len) return done(err);
    var layer = handlers[idx++];
    if (layer.match(msgType)) {
      if (err)
        layer.handleError(err, ctx, next);
      else
        layer.handleRequest(ctx, next);
    } else {
      next(err);
    }
  }

  next(null);
};

Proto.prototype.use = function (fn) {
  this._handlers.push(new Layer('*', fn));
  return this;
};

[
  'text',
  'image',
  'voice',
  'video',
  'shortVideo',
  'location',
  'link',
  'event'
].forEach(function (type) {
  Proto.prototype[type] = function(fn) {
    this._handlers.push(new Layer(type, fn));
    return this;
  };
});

Proto.prototype.listen = function() {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};

module.exports = Proto;

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