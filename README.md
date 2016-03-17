# easy-wechat

简易的微信公众号开发(被动回复消息)框架。

## Usage

基本配置：

```javascript
var wx = require('easy-wechat');
var wechat = wx({
  token: 'token',
  encodingAESKey: 'encodingAESKey',
  appId: 'appId',
  secure: true // true 安全模式, false 明文模式
});
```

仿照了 express 的路由 API，可以通过 `wechat.text()` `wechat.image()` `wechat.shortVideo()` 等方法注册对应类型消息的逻辑处理。`wechat.use()` 可以匹配所有类型的消息。

msg, req, res, wechat 被封装成一个上下文对象 Context { msg, \_req, \_res, wechat }，并在该对象上实现了 reply 方法。

```javascript
wechat
.use(function (ctx, next) {
  console.log(ctx.msg);
  next();
})
.text(function (ctx, next) {
  var msg = ctx.msg;
  if (msg.content === '不会用') {
    ctx.reply({
      type: 'text',
      content: '妈的智障'
    });
  } else {
    next();
  }
})
.text(function (ctx, next) {
  var msg = ctx.msg;
  ctx.reply({
    type: 'text',
    content: '你发送的是文本消息：' + msg.content
  });
});

// 错误统一处理
wechat.use(function(err, ctx, next) {
  if (err) {
    console.error(err.stack);
    return ctx.reply({
      type: 'text',
      content: err.message
    });
  }
  ctx.reply({
    type: 'text',
    content: '不支持的消息类型'
  });
});
```

解析后的 msg 对象属性名采用小驼峰规则，例如：

```javascript
{
  "toUserName": "gh_asdfghjk",
  "fromUserName": "ojqwertyuiop",
  "createTime": "1458218861",
  "msgType": "location",
  "locationX": "30.554989",
  "locationY": "104.002922",
  "scale": "16",
  "label": "双流县四川大学(江安校区)内",
  "msgId": "6263002318809076599"
}
```

```javascript
wechat.listen(3000, function() {
  console.log('wechat is running at port 3000');
});
```
