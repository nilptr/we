# we

简易的微信公众号开发(被动回复消息)框架。

## Usage

```javascript
var we = require('we');
var wechat = we({
  token: 'token',
  encodingAESKey: 'encodingAESKey',
  appId: 'appId',
  secure: true // true 安全模式, false 明文模式
});

wechat
.use(function (msg, req, res, next) {
  console.log(msg);
  next();
})
.text(function (msg, req, res, next) {
  res.reply({
    type: 'text',
    content: '文本消息：' + msg.content
  });
});

wechat.use(function(err, msg, req, res, next) {
  if (err) {
    return res.reply({
      type: 'text',
      content: err.message
    });
  }
  res.reply({
    type: 'text',
    content: '不支持的消息类型'
  });
});

wechat.listen(3000, function() {
  console.log();
});
```