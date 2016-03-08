
var tpl = require('./tpl');

function reply(obj) {
  var req = this.req;

  var msg = req.msg;
  var query = req.query;
  var msgCrypto = this.wechat._msgCrypto;

  var data = {
    toUserName: msg.fromUserName,
    fromUserName: msg.toUserName
  };

  Object.keys(obj).forEach(function(k) {
    if (obj.hasOwnProperty(k))
      data[k] = obj[k];
  });

  var xml = tpl[obj.msgType](data);
  if (query['encrypt_type'] && query['encrypt_type'] !== 'raw')
    xml = msgCrypto.encryptMsg(xml);

  this.end(xml);
  return this;
}

module.exports = reply;