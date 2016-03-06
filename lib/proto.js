var util = require('util');

var WXBizMsgCrypt = require('./wxCrypt');

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

  wechat._msgCrypto = new WXBizMsgCrypt(token, encodingAesKey, appId);

  return wechat;
}

util.inherits(Proto, Function);

Proto.prototype.handle = function(req, res, next) {

};

