
var tpl = require('./message/tpl');

function Context(msg, req, res, wechat) {
  this.msg = msg;
  this._req = req;
  this._res = res;
  this.wechat = wechat;

  // todo: feature: session
  this.session = null;
}

Context.prototype.reply = function (obj) {
  var msg = this.msg;
  var query = this._req.query;
  var msgCrypto = this.wechat._msgCrypto;

  var data = {
    toUserName: msg.fromUserName,
    fromUserName: msg.toUserName,
    createTime: Date.now()
  };

  Object.keys(obj).forEach(function(k) {
    if (obj.hasOwnProperty(k))
      data[k] = obj[k];
  });

  var xml = tpl[obj.type || obj.msgType](data);
  if (query['encrypt_type'] && query['encrypt_type'] !== 'raw')
    xml = msgCrypto.encryptMsg(xml);

  this._res.end(xml);
  return this;
};

module.exports = Context;